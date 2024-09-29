'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Calendar from '../../components/calendar';
import NicknameModal from '../../components/modal/nicknamemodal';
import '../../styles/pages/main.scss';
import NotificationModal from '../../components/modal/notificationmodal';
import Image from 'next/image';
import { requestFcmToken } from '@/function/requestFcmToken';
import { useDispatch } from 'react-redux';
import {
  setEvents,
  loadState,
} from '../../store/eventsSlice';
import { messaging } from '../../../firebase/firebase-config';
import { Messaging } from 'firebase/messaging';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

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

  // 1. 로컬 스토리지에서 user 정보를 불러옴
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. 클라이언트에서만 localStorage에서 상태 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedState = loadState();
      if (loadedState.events.length > 0) {
        dispatch(setEvents(loadedState.events));
      }
    }
  }, [dispatch]);

  // 3. 토큰만 갱신하는 함수
  const refreshToken = async (userId: string) => {
    try {
      const refreshResponse = await axios.post(
        '/api/user/refreshToken',
        { userId }
      );
      const newToken = refreshResponse.data.token;
      localStorage.setItem('token', newToken);
      console.log('새 토큰이 발급되었습니다.');
    } catch (refreshError) {
      console.error(
        '토큰 재발급 중 오류 발생:',
        refreshError
      );
    }
  };

  // 4. 토큰을 새로 갱신하고 user 정보가 없으면 서버에서 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        console.log('사용자 정보가 없습니다.');
        return;
      }

      // 5. 로컬에 저장된 user 정보가 없으면 서버에서 불러옴
      if (!user) {
        try {
          const userInfoResponse = await axios.get(
            `/api/user/info?user_id=${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(userInfoResponse.data);
          localStorage.setItem(
            'user',
            JSON.stringify(userInfoResponse.data)
          ); // user 정보 로컬에 저장
        } catch (error) {
          console.error(
            '사용자 정보를 가져오는 중 오류 발생:',
            error
          );
        }
      } else {
        // 6. 이미 로컬에 user 정보가 있으면 토큰만 갱신
        await refreshToken(userId);
      }
    };

    fetchData();
  }, [router, user]);

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
      );
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
        <>
          <p>{user?.nickname}의 일정</p>
          <span>
            {user?.kakao_image ? (
              <Image
                src={user?.kakao_image}
                alt="User"
                className="user-image"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} />
            )}
          </span>
        </>
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
