'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface NicknameModalProps {
  userId: string;
  token: string;
  onSubmitSuccess: (nickname: string) => void; // 성공 시 호출할 함수
  onClose: () => void; // 모달 닫기
}

const NicknameModal: React.FC<NicknameModalProps> = ({
  userId,
  token,
  onSubmitSuccess,
}) => {
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNicknameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      setErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    try {
      // 닉네임 저장 요청
      await axios.post(
        '/api/user/nickname',
        { userId, nickname },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 닉네임 저장 성공 시 부모 컴포넌트에 알리기
      onSubmitSuccess(nickname);
    } catch (error) {
      console.error('닉네임 설정 중 오류 발생:', error);
      setErrorMessage(
        '닉네임 설정 중 오류가 발생했습니다.'
      );
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>닉네임 설정</h2>
        <input
          className="modal-input"
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임을 입력하세요."
        />
        {errorMessage && (
          <p style={{ color: 'red' }}>{errorMessage}</p>
        )}
        <div className="modal-buttons">
          <button onClick={handleSubmit}>저장</button>
          {/* <button onClick={onClose}>닫기</button> */}
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;
