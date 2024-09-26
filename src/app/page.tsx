'use client'; // 클라이언트 컴포넌트임을 명시

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Calendar from '../components/calendar';
import NicknameModal from '../components/modal/nicknamemodal';
import '../styles/pages/main.scss';

import NotificationModal from '../components/modal/notificationmodal';
import Image from 'next/image';
import { handleLogin } from '@/function/handlelogin';
import { requestFcmToken } from '@/function/requestFcmToken'; // import requestFcmToken
import { useDispatch } from 'react-redux';
import { setEvents, loadState } from '../store/eventsSlice'; // 적절한 경로로 import
import { messaging } from '../../firebase/firebase-config'; // Firebase Messaging import
import { Messaging } from 'firebase/messaging'; // Messaging 타입 import

// 동적 페이지에 적용
export const dynamic = 'force-dynamic';

interface User {
  id: number;
  nickname: string;
  kakao_image: string | null;
}

const Main: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();

  // 클라이언트에서만 localStorage에서 상태 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedState = loadState(); // localStorage에서 상태를 불러옴
      if (loadedState.events.length > 0) {
        dispatch(setEvents(loadedState.events)); // Redux 상태에 로드된 이벤트 저장
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window === 'undefined') return; // 서버사이드 렌더링 환경 방지

      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) {
        console.log('사용자 정보가 없습니다.');
        return;
      }
      try {
        // 사용자 정보 요청
        const userInfoResponse = await axios.get(
          `/api/user/info?user_id=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(userInfoResponse.data);

        // 닉네임이 없으면 모달창 열기
        if (!userInfoResponse.data.nickname) {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error(
          '사용자 정보를 가져오는 중 오류 발생:',
          error
        );

        try {
          // 토큰 재발급 시도
          const refreshResponse = await axios.post(
            '/api/user/refreshToken',
            { userId }
          );
          const newToken = refreshResponse.data.token;

          localStorage.setItem('token', newToken);
          console.log('새 토큰이 발급되었습니다.');

          // 새 토큰으로 사용자 정보 다시 요청
          const retryResponse = await axios.get(
            `/api/user/info?user_id=${userId}`,
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );
          setUser(retryResponse.data);

          if (!retryResponse.data.nickname) {
            setIsModalOpen(true);
          }
        } catch (refreshError) {
          console.error(
            '토큰 재발급 중 오류 발생:',
            refreshError
          );
        }
      }
    };

    fetchData();
  }, [router]);

  // 권한 체크 함수
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if (typeof window === 'undefined' || !user) return; // 서버사이드 렌더링 환경 및 user 상태 확인

      const storedPermission = localStorage.getItem(
        'notificationPermission'
      );
      if (
        Notification.permission === 'default' &&
        !storedPermission
      ) {
        setModalVisible(true); // 권한 요청 모달 열기
      } else if (
        Notification.permission === 'granted' &&
        !storedPermission
      ) {
        localStorage.setItem(
          'notificationPermission',
          'granted'
        );
        await requestFcmToken(
          messaging as Messaging,
          user!.id.toString()
        ); // 파라미터로 messaging과 userId 전달
      } else if (Notification.permission === 'denied') {
        localStorage.setItem(
          'notificationPermission',
          'denied'
        );
      }
    };

    checkNotificationPermission();
  }, [user]); // user 상태가 변경될 때만 실행

  const requestNotificationPermission = async () => {
    const permission =
      await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(
        'notificationPermission',
        'granted'
      );
      await requestFcmToken(
        messaging as Messaging,
        user!.id.toString()
      ); // 파라미터로 messaging과 userId 전달
    } else if (permission === 'denied') {
      localStorage.setItem(
        'notificationPermission',
        'denied'
      );
    }
  };

  const handleNicknameSubmitSuccess = (
    nickname: string
  ) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, nickname } : null
    );
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAllowNotifications = () => {
    requestNotificationPermission();
    setModalVisible(false);
  };

  return (
    <div className="main-page">
      <div className="main-header">
        {user ? (
          <>
            <p>{user.nickname}의 일정</p>
            <span>
              {user.kakao_image ? (
                <Image
                  src={user.kakao_image}
                  alt="User"
                  className="user-image"
                />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </span>
          </>
        ) : (
          <>
            <p>로그인이 필요합니다.</p>
            <div
              className="login-button"
              onClick={handleLogin}
            >
              Login
            </div>
          </>
        )}
      </div>
      <Calendar />

      {isModalOpen && user && (
        <NicknameModal
          userId={user.id.toString()}
          token={localStorage.getItem('token')!}
          onSubmitSuccess={handleNicknameSubmitSuccess}
          onClose={handleModalClose}
        />
      )}

      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAllow={handleAllowNotifications}
      />
    </div>
  );
};

export default Main;
