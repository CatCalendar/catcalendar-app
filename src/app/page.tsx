'use client'; // 클라이언트 컴포넌트임을 명시

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Calendar from '../components/calendar';
import NicknameModal from '../components/modal/nicknamemodal';
import '../styles/pages/main.scss';
import {
  messaging,
  getToken,
} from '../../firebase/firebase-config';
import NotificationModal from '../components/modal/notificationmodal';
import Image from 'next/image';
import { handleLogin } from '@/function/handlelogin';
// 동적 페이지에 적용
export const dynamic = 'force-dynamic';

interface User {
  id: number;
  nickname: string;
  kakao_image: string | null;
}

const Main: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

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
          // 오류가 발생하면 토큰을 재발급하고 다시 요청
          const refreshResponse = await axios.post(
            '/api/user/refreshToken',
            {
              userId,
            }
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const storedPermission = localStorage.getItem(
        'notificationPermission'
      );
      if (
        Notification.permission === 'default' &&
        !storedPermission
      ) {
        setModalVisible(true);
      } else if (
        Notification.permission === 'granted' &&
        !storedPermission
      ) {
        localStorage.setItem(
          'notificationPermission',
          'granted'
        );
        requestFcmToken();
      } else if (Notification.permission === 'denied') {
        localStorage.setItem(
          'notificationPermission',
          'denied'
        );
      }
    };

    checkNotificationPermission();
  }, []);

  const requestFcmToken = async () => {
    try {
      const fcmToken = await getToken(messaging);
      const storedFcmToken =
        localStorage.getItem('fcmToken');

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
      console.error(
        'FCM 토큰 요청 중 오류 발생:',
        fcmError
      );
    }
  };

  const requestNotificationPermission = async () => {
    const permission =
      await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem(
        'notificationPermission',
        'granted'
      );
      requestFcmToken();
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

  if (loading) {
    return <p>로딩 중...</p>;
  }

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
            {/* 클릭 가능한 div */}
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

      {/* 닉네임 설정 모달 */}
      {isModalOpen && user && (
        <NicknameModal
          userId={user.id.toString()}
          token={localStorage.getItem('token')!}
          onSubmitSuccess={handleNicknameSubmitSuccess}
          onClose={handleModalClose}
        />
      )}

      {/* 알림 권한 요청 모달창 */}
      <NotificationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAllow={handleAllowNotifications}
      />
    </div>
  );
};

export default Main;
