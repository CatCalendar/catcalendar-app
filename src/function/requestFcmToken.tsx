import axios from 'axios';
import { getToken, Messaging } from 'firebase/messaging';

// FCM 토큰 요청 및 저장 함수
export const requestFcmToken = async (
  messaging: Messaging, // Firebase Messaging 타입 지정
  userId: string
) => {
  try {
    const fcmToken = await getToken(messaging);
    if (fcmToken) {
      const fcmResponse = await axios.post(
        '/api/save-token',
        {
          token: fcmToken,
          userId: userId,
        }
      );
      localStorage.setItem(
        'fcmToken',
        fcmResponse.data.token
      );
      console.log(
        'FCM 토큰이 로컬 스토리지에 저장되었습니다.'
      );
    } else {
      console.warn('FCM 토큰을 가져올 수 없습니다.');
    }
  } catch (fcmError) {
    console.error('FCM 토큰 요청 중 오류 발생:', fcmError);
  }
};
