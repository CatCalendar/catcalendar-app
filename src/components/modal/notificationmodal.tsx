'use client';

import React from 'react';
import '../../styles/components/notificationmodal.scss'; // 모달 스타일 가져오기

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onAllow: () => void;
}

const NotificationModal: React.FC<
  NotificationModalProps
> = ({ visible, onClose, onAllow }) => {
  if (!visible) return null;

  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal">
        <h2>알림 권한 요청</h2>
        <p>
          캘린더 알림을 수신하기 위해 알림 권한을
          허용해주세요.
        </p>
        <div className="modal-buttons">
          <button className="allow-btn" onClick={onAllow}>
            허용
          </button>
          <button className="deny-btn" onClick={onClose}>
            거부
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
