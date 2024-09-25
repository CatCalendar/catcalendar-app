'use client';

import React, { useState, useEffect } from 'react';
import '../../styles/components/vieweventsmodal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import {
  CustomEvent,
  removeEvent,
  addEvent,
} from '../../store/eventsSlice';
import EventModal from './eventmodal';
import axios from 'axios'; // axios 추가
import { message } from 'antd';

interface ViewEventsModalProps {
  visible: boolean;
  selectedDate: Date;
  token: string;
  events: CustomEvent[];
  onClose: () => void;
}

const ViewEventsModal: React.FC<ViewEventsModalProps> = ({
  visible,
  selectedDate,
  token,
  events,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [localEvents, setLocalEvents] = useState<
    CustomEvent[]
  >([]);
  const [isEditModalVisible, setIsEditModalVisible] =
    useState(false);
  const [eventToEdit, setEventToEdit] =
    useState<CustomEvent | null>(null);

  // events가 변경될 때 로컬 상태를 최신 events로 업데이트
  useEffect(() => {
    setLocalEvents(events);
  }, [events]);

  const handleDelete = async (event: CustomEvent) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      console.log('삭제할 이벤트:', event.id);
      await axios.delete(`/api/event`, {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          eventId: event.id,
          userId: userId,
        },
      });

      // Redux와 로컬 상태에서 이벤트 삭제
      setLocalEvents((prevEvents) =>
        prevEvents.filter((e) => e.id !== event.id)
      );
      // Redux에서도 수정된 이벤트를 반영
      dispatch(removeEvent({ id: event.id })); // ID로 기존 이벤트 삭제
      message.success(
        '이벤트가 성공적으로 삭제되었습니다.'
      );
    } catch (error) {
      console.error('이벤트 삭제 중 오류 발생:', error);
      message.error('이벤트 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (event: CustomEvent) => {
    setEventToEdit(event);
    setIsEditModalVisible(true);
  };

  const formatTimeForSave = (time: string): string => {
    if (time.length === 8 && time.endsWith(':00')) {
      return time.slice(0, 5); // "14:00:00" -> "14:00"
    }
    return time; // 이미 "HH:mm" 형식이면 그대로 반환
  };

  const handleEditModalOk = (updatedEvent: CustomEvent) => {
    const formattedEvent = {
      ...updatedEvent,
      time: formatTimeForSave(updatedEvent.time), // 시간을 포맷팅하여 저장
    };

    const updatedEvents = localEvents.map((e) =>
      e.id === formattedEvent.id ? formattedEvent : e
    );

    setLocalEvents(updatedEvents); // 로컬 상태 업데이트

    // Redux에서도 수정된 이벤트를 반영
    dispatch(removeEvent({ id: formattedEvent.id })); // ID로 기존 이벤트 삭제
    dispatch(addEvent(formattedEvent));

    setIsEditModalVisible(false);
    setEventToEdit(null);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEventToEdit(null);
  };

  if (!visible) {
    return null;
  }

  const formatTime = (time: string): string => {
    if (time.length === 5 && time.includes(':')) {
      return time; // 이미 HH:mm 형식이면 그대로 반환
    }

    const [hours, minutes] = time.split(':').map(Number);
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(
      2,
      '0'
    );

    return `${formattedHours}:${formattedMinutes}`;
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          {selectedDate.toLocaleDateString('ko-KR')}의 일정
        </h2>
        {localEvents.length > 0 ? (
          <ul>
            {localEvents.map((event, index) => (
              <div className="event-header" key={index}>
                <div className="event-title">
                  <p>
                    {formatTime(event.time)}{' '}
                    <span className="title-color">
                      {event.title}
                    </span>
                  </p>
                  <div className="event-buttons">
                    <button
                      onClick={() => handleEdit(event)}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(event)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="event-detail">
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    style={{ marginRight: '5px' }}
                  />
                  {event.details}
                </div>
              </div>
            ))}
          </ul>
        ) : (
          <p>해당 날짜에 일정이 없습니다.</p>
        )}
        <div className="exit-button-box">
          <button className="exit-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
      {isEditModalVisible && eventToEdit && (
        <EventModal
          visible={isEditModalVisible}
          selectedDate={eventToEdit.date}
          token={token}
          onOk={handleEditModalOk}
          onCancel={handleEditModalCancel}
          event={eventToEdit}
        />
      )}
    </div>
  );
};

export default ViewEventsModal;
