import {
  messaging,
  getToken,
} from '../../firebase/firebase-config';
import axios from 'axios';

export const requestFcmToken = async () => {
  try {
    const fcmToken = await getToken(messaging);
    const storedFcmToken = localStorage.getItem('fcmToken');

    if (fcmToken && fcmToken !== storedFcmToken) {
      const fcmResponse = await axios.post(
        '/api/save-token',
        {
          token: fcmToken,
          userId: localStorage.getItem('userId'),
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
