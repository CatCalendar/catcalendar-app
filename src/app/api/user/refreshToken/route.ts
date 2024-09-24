import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json(
      { message: 'userId가 필요합니다.' },
      { status: 400 }
    );
  }

  try {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '5m' }
    );
    return NextResponse.json({ token });
  } catch (error) {
    console.error('토큰 재발급 오류:', error);
    return NextResponse.json(
      { message: '토큰 재발급 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
