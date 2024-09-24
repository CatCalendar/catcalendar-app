import { NextRequest, NextResponse } from 'next/server';
import db from '../../../../lib/db'; // db 모듈 경로가 정확한지 확인
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

interface User extends RowDataPacket {
  id: number;
  nickname: string;
  kakao_nickname: string;
  kakao_image: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  // 1. userId가 없는 경우
  if (!userId) {
    return NextResponse.json(
      { message: '유저 ID가 없습니다.' },
      { status: 400 }
    );
  }

  // 2. Authorization 헤더에서 토큰 가져오기
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: '토큰이 제공되지 않았습니다.' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  try {
    // 3. JWT 검증
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
    const decodedUserId = String(
      (decoded as { userId: number }).userId
    ); // 문자열로 변환

    // 4. 토큰의 userId와 요청의 userId 일치 여부 확인 (문자열로 비교)
    if (userId !== decodedUserId) {
      return NextResponse.json(
        { message: '잘못된 사용자 요청입니다.' },
        { status: 403 }
      );
    }

    // 5. DB에서 사용자 정보 조회
    const [users] = await db.query<User[]>(
      'SELECT id, nickname, kakao_nickname, kakao_image FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 6. 사용자 정보 반환
    const user = users[0];

    return NextResponse.json(user);
  } catch (error) {
    // JWT 검증 중 오류
    console.error('JWT 검증 오류:', error);
    return NextResponse.json(
      { message: '인증 실패: 잘못된 토큰' },
      { status: 401 }
    );
  }
}
