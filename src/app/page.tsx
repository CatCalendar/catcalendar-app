'use client';

import React, { useEffect } from 'react';
import Calendar from '../components/calendar';
import '../styles/pages/main.scss';
import { handleLogin } from '@/function/handlelogin';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // 로컬 스토리지에서 userId 확인
    const storedUser = localStorage.getItem('userId');

    // userId가 있으면 main 페이지로 리다이렉트
    if (storedUser) {
      router.push('/main');
    }
  }, [router]);

  return (
    <div className="main-page">
      <div className="main-header">
        <p>로그인이 필요합니다.</p>
        <div className="login-button" onClick={handleLogin}>
          Login
        </div>
      </div>
      <Calendar />
    </div>
  );
};

export default LoginPage;
