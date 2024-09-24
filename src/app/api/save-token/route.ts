// app/api/save-token/route.ts
import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { ResultSetHeader } from 'mysql2';

const saveTokenToDatabase = async (
  userId: string,
  fcmToken: string
) => {
  try {
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE users SET fcm_token = ? WHERE id = ?`,
      [fcmToken, userId]
    );

    if (result.affectedRows === 0) {
      await db.query(
        `INSERT INTO users (id, fcm_token) VALUES (?, ?)`,
        [userId, fcmToken]
      );
    }
  } catch (error) {
    console.error(
      'Error saving FCM token to database:',
      error
    );
    throw new Error('FCM 토큰 저장 중 오류 발생');
  }
};

export async function POST(request: Request) {
  const { token: fcmToken, userId } = await request.json();

  if (!fcmToken || !userId) {
    return NextResponse.json(
      { error: 'FCM 토큰과 userId는 필수입니다.' },
      { status: 400 }
    );
  }

  try {
    await saveTokenToDatabase(userId, fcmToken);
    return NextResponse.json(
      {
        message: 'FCM 토큰이 저장되었습니다.',
        token: fcmToken,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
