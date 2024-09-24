'use client'; // 클라이언트 컴포넌트임을 명시

import React from 'react';

const Main: React.FC = () => {
  const handleLogin = () => {
    const clientId =
      process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri =
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error('환경변수가 설정되지 않았습니다.');
      return;
    }

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <div>
      {/* 클릭 가능한 div */}
      <div
        onClick={handleLogin}
        style={{
          cursor: 'pointer',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '5px',
          textAlign: 'center',
          width: '100px',
        }}
      >
        Login
      </div>
      <p>Main</p>
    </div>
  );
};

export default Main;
