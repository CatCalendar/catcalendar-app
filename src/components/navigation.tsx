'use client'; // 클라이언트 컴포넌트임을 명시

import React from 'react';
import '../styles/components/navigation.scss';
import {
  faCalendar,
  faCircleUser,
  faGear,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';

const Navigation: React.FC = () => {
  const router = useRouter(); // 새로운 useRouter 사용
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

  // 페이지 이동 함수 정의
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <div className="nav_bar">
      <div className="nav_bar_content">
        {/* ProfilePage */}
        <div
          className="nav_bar_icon"
          onClick={() => handleNavigation('/userInfo')}
        >
          <FontAwesomeIcon
            icon={faCircleUser}
            className={
              pathname === '/userinfo'
                ? 'nav-link active'
                : 'nav-link'
            }
          />
        </div>
        {/* MainPage */}
        <div
          className="nav_bar_icon"
          onClick={() => handleNavigation('/main')}
        >
          <FontAwesomeIcon
            icon={faCalendar}
            className={
              pathname === '/main'
                ? 'nav-link active'
                : 'nav-link'
            }
          />
        </div>
        {/* SettingPage */}
        <div
          className="nav_bar_icon"
          onClick={() => handleNavigation('/allList')}
        >
          <FontAwesomeIcon
            icon={faList}
            className={
              pathname === '/alllist'
                ? 'nav-link active'
                : 'nav-link'
            }
          />
        </div>
        <div
          className="nav_bar_icon"
          onClick={() => handleNavigation('/settings')}
        >
          <FontAwesomeIcon
            icon={faGear}
            className={
              pathname === '/settings'
                ? 'nav-link active'
                : 'nav-link'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
