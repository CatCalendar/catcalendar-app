'use client';

import React, { useState, useEffect } from 'react';
import Calendar from '../../components/calendar';
import NicknameModal from '../../components/modal/nicknamemodal';
import '../../styles/pages/main.scss';
// import NotificationModal from '../../components/modal/notificationmodal';
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
  // const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  // 로컬 스토리지에서 user 정보를 불러옴
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      requestNotificationPermission();
    }
  }, []);

  // 클라이언트에서 localStorage에서 상태 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadedState = loadState();
      if (loadedState.events.length > 0) {
        dispatch(setEvents(loadedState.events));
      }
    }
  }, [dispatch]);

  // 알림 권한 요청 함수
  const requestNotificationPermission = async () => {
    try {
      console.log('알림 권한 요청 중...', user);

      // 권한이 'default' 상태일 때만 requestPermission 호출
      const permission =
        Notification.permission === 'default'
          ? await Notification.requestPermission() // 처음 권한 요청
          : Notification.permission; // 이미 권한이 설정된 경우

      // 권한이 granted인 경우에만 FCM 토큰 요청
      if (permission === 'granted') {
        console.log('알림 권한이 부여되었습니다.');
        localStorage.setItem(
          'notificationPermission',
          'granted'
        );

        // FCM 토큰 요청
        const fcmToken = await requestFcmToken(
          messaging as Messaging,
          user!.id.toString()
        );

        if (fcmToken!) {
          console.log('FCM 토큰 요청 성공:', fcmToken);
        } else {
          console.warn('FCM 토큰을 가져올 수 없습니다.');
        }
      } else {
        console.warn('알림 권한이 부여되지 않았습니다.');
      }
    } catch (error) {
      console.error('알림 권한 요청 중 오류 발생:', error);
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
    </div>
  );
};

export default Main;
