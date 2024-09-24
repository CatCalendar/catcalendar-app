// app/api/send-notification/route.ts
import { NextResponse } from 'next/server';
import { sendFCMNotification } from '../../../../firebase/admin-config'; // 서버에서 사용하는 Firebase 설정 가져오기

// POST 요청 처리
export async function POST(request: Request) {
  try {
    const { message } = await request.json(); // 요청 본문에서 메시지 데이터 가져오기

    // 서버에서 FCM 푸시 알림 전송
    const result = await sendFCMNotification(message);
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('푸시 알림 전송 실패:', error);
    return NextResponse.json(
      { error: '푸시 알림 전송 중 오류 발생' },
      { status: 500 }
    );
  }
}
