'use client'; // 클라이언트 컴포넌트임을 명시

import React from 'react';
import { handleLogin } from '../function/handlelogin';
const Main: React.FC = () => {
  return (
    <div>
      {/* 클릭 가능한 div */}
      <div onClick={handleLogin}>Login</div>
      <p>Main</p>
    </div>
  );
};

export default Main;
