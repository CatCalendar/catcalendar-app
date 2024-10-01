'use client';

import React, { useState, useEffect } from 'react';
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
  const dispatch = useDispatch();

  // 로컬 스토리지에서 user 정보를 불러옴
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
    // 사용자가 이미 권한을 부여했는지 확인
    const permission =
      Notification.permission === 'default'
        ? await Notification.requestPermission() // 처음 권한 요청
        : Notification.permission; // 이미 권한이 설정된 경우

    console.log('ok 누른 후:', permission);
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
  };

  // 페이지가 로드될 때 알림 권한 확인 및 요청
  useEffect(() => {
    const storedPermission = localStorage.getItem(
      'notificationPermission'
    );
    console.log('storedPermission:', storedPermission);
    // 알림 권한을 한 번도 허용한 적이 없을 때만 모달을 띄움
    if (
      !storedPermission ||
      Notification.permission === 'default' ||
      storedPermission === 'denied'
    ) {
      setModalVisible(true); // 모달을 먼저 띄움
    }
  }, [user]);

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
    setModalVisible(false); // 모달 닫기
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
