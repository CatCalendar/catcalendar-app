import admin, { ServiceAccount } from 'firebase-admin';

// 서비스 계정 설정
const serviceAccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  privateKey:
    process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY!.replace(
      /\\n/g,
      '\n'
    ),
  clientEmail:
    process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL!,
};

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// FCM 푸시 알림 전송 함수
export const sendFCMNotification = async (data: {
  token: string;
  title: string;
  body: string;
}) => {
  const message = {
    notification: {
      title: data.title,
      body: data.body,
    },
    token: data.token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('푸시 알림 전송 성공:', response);
    return response;
  } catch (error) {
    console.error('푸시 알림 전송 실패:', error);
    throw new Error('FCM 푸시 알림 전송 실패');
  }
};
