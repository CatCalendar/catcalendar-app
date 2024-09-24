'use client'; // 클라이언트 컴포넌트임을 명시

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import '../styles/components/navigation.scss';

const Navigation: React.FC = () => {
  const pathname = usePathname(); // 경로를 가져오기 위해 usePathname 사용

  // 사용할 경로를 배열로 정의
  const allowedPaths: string[] = [
    '/',
    '/mylist',
    '/userinfo',
    '/set',
  ];

  // 현재 경로가 undefined이거나 allowedPaths에 포함되지 않으면 null 반환
  if (!pathname || !allowedPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="nav_bar">
      <div className="nav_bar_content">
        <Link
          href="/"
          className={
            pathname === '/'
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          Main
        </Link>
        <Link
          href="/mylist"
          className={
            pathname === '/mylist'
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          mylist
        </Link>
        <Link
          href="/userinfo"
          className={
            pathname === '/userinfo'
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          userinfo
        </Link>
        <Link
          href="/set"
          className={
            pathname === '/set'
              ? 'nav-link active'
              : 'nav-link'
          }
        >
          set
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
