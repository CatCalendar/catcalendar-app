'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  messaging,
  getToken,
} from '../../../firebase/firebase-config';

// 동적 페이지에 적용
export const dynamic = 'force-dynamic';

const LoginRedirect: React.FC = () => {
  const router = useRouter();
  const [isHandlingLogin, setIsHandlingLogin] =
    useState(false); // 로그인 처리가 한 번만 실행되도록 상태 추가

  useEffect(() => {
    const handleLoginRedirect = async () => {
      const code = new URLSearchParams(
        window.location.search
      ).get('code');

      if (code && !isHandlingLogin) {
        setIsHandlingLogin(true); // 로그인 처리 중으로 상태 설정

        try {
          const response = await axios.get(
            `/api/user/kakaoLogin?code=${code}`,
            {
              withCredentials: true,
            }
          );

          const { token, userId } = response.data;

          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId.toString());

          router.push('/'); // 메인 페이지로 리다이렉트
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error(
              'Axios error 발생:',
              error.response?.data || error.message || error
            );
          } else {
            console.error('일반적인 오류 발생:', error);
          }
        }
      } else if (!code) {
        console.warn('카카오 인증 코드가 없습니다.');
      }
    };

    if (!isHandlingLogin) {
      handleLoginRedirect(); // 상태 변화에 따라 한 번만 실행되도록 제어
    }
  }, [isHandlingLogin, router]);

  return <div>로그인 처리 중...</div>;
};

export default LoginRedirect;
