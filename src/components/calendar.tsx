'use client';

import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/calendar.scss'; // CSS 모듈로 변경
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import EventModal from './modal/eventmodal';
import ViewEventsModal from './modal/vieweventsmodal'; // 추가된 모달
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  addEvent,
  setEvents,
  CustomEvent,
} from '../store/eventsSlice';
import axios from 'axios'; // API 호출을 위해 axios 추가

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );
  const [isModalVisible, setIsModalVisible] =
    useState(false);
  const [isViewingEvents, setIsViewingEvents] =
    useState(false); // 모달 타입 상태
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);
  const [viewingEvents, setViewingEvents] = useState<
    CustomEvent[]
  >([]); // 해당 날짜의 이벤트

  const dispatch = useDispatch();
  const events = useSelector(
    (state: RootState) => state.events.events || []
  );
  const longPressTimeout = useRef<NodeJS.Timeout | null>(
    null
  );

  const formatTime = (time: string): string => {
    // "14:00:00", "14:30:00" -> "14:00", "14:30"
    if (time && time.length === 8 && time.endsWith(':00')) {
      return time.slice(0, 5); // "14:00:00" -> "14:00"
    }
    return time; // 이미 "HH:mm" 형식일 경우 그대로 반환
  };

  useEffect(() => {
    // Redux 상태의 events가 변경될 때마다 viewingEvents를 업데이트
    if (selectedDate) {
      const eventsForDate = events.filter(
        (event) =>
          new Date(event.date).toDateString() ===
          selectedDate.toDateString()
      );
      setViewingEvents(eventsForDate);
    }
  }, [events, selectedDate]);

  // 서버에서 이벤트 목록을 불러오는 useEffect 추가
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (userId && token) {
          const response = await axios.get(
            `/api/event?user_id=${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // 서버에서 받은 이벤트 데이터를 시간 포맷팅 후 Redux 상태로 저장
          const formattedEvents = response.data.map(
            (event: CustomEvent) => ({
              ...event,
              time: formatTime(event.time), // 시간을 "HH:mm" 형식으로 포맷
            })
          );
          // 포맷팅된 이벤트 데이터를 Redux에 저장
          dispatch(setEvents(formattedEvents));
        }
      } catch (error) {
        console.error(
          '이벤트 목록을 가져오는 중 오류 발생:',
          error
        );
      }
    };

    fetchEvents();
  }, [dispatch]);

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (
    month: number,
    year: number
  ) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    );
    setCurrentDate(new Date(prevMonth));
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    );
    setCurrentDate(new Date(nextMonth));
  };

  const handleDateTouchStart = (date: number) => {
    const selected = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    setSelectedDate(selected);

    longPressTimeout.current = setTimeout(() => {
      const eventsForDate = events.filter(
        (event) =>
          new Date(event.date).toDateString() ===
          new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            date
          ).toDateString()
      );
      console.log('꾹:', eventsForDate);
      setViewingEvents(eventsForDate);
      setIsViewingEvents(true);
      setIsModalVisible(true);
    }, 1000); // 1초 이상 클릭 시 모달 표시
  };

  const handleDateTouchEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;

      if (!isViewingEvents) {
        // 1초 미만 클릭 시 일정 추가 모달 표시
        setIsModalVisible(true);
      }
    }
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = [
      '일',
      '월',
      '화',
      '수',
      '목',
      '금',
      '토',
    ];
    return daysOfWeek.map((day, index) => (
      <div
        key={index}
        className={`day-of-week ${
          index === 0
            ? 'sunday'
            : index === 6
            ? 'saturday'
            : ''
        }`}
      >
        {day}
      </div>
    ));
  };

  const renderDates = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const daysInCurrentMonth = daysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const daysArray = [];

    for (let i = 0; i < firstDay; i++) {
      daysArray.push(
        <div
          key={`empty-${i}`}
          className="empty-slot"
        ></div>
      );
    }

    for (let date = 1; date <= daysInCurrentMonth; date++) {
      const dayOfWeek = new Date(
        year,
        month,
        date
      ).getDay();
      const eventsForDate = events?.filter((event) => {
        // event.date가 Date 객체가 아니라면 변환
        const eventDate = new Date(event.date);
        return (
          eventDate.toDateString() ===
          new Date(year, month, date).toDateString()
        );
      });

      daysArray.push(
        <div
          key={date}
          className={`date ${
            dayOfWeek === 0
              ? 'sunday'
              : dayOfWeek === 6
              ? 'saturday'
              : ''
          }`}
          onTouchStart={() => handleDateTouchStart(date)}
          onTouchEnd={handleDateTouchEnd}
          onMouseDown={() => handleDateTouchStart(date)}
          onMouseUp={handleDateTouchEnd}
        >
          {date}
          {eventsForDate && eventsForDate.length > 0 && (
            <div className="event-count">
              <FontAwesomeIcon icon={faStar} />
            </div>
          )}
        </div>
      );
    }

    return daysArray;
  };

  const handleModalOk = (event: CustomEvent) => {
    if (!isViewingEvents) {
      dispatch(addEvent(event)); // Date 객체 그대로 전달
    }
    setIsModalVisible(false);
    setIsViewingEvents(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setIsViewingEvents(false);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <span onClick={handlePrevMonth}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </span>
        <span className="calendar-header-text">
          {currentDate.getFullYear()}년{' '}
          {currentDate.getMonth() + 1}월
        </span>
        <span onClick={handleNextMonth}>
          <FontAwesomeIcon icon={faChevronRight} />
        </span>
      </div>
      <div className="calendar-body">
        <div className="days-of-week">
          {renderDaysOfWeek()}
        </div>
        <div className="dates">{renderDates()}</div>
      </div>
      {isModalVisible &&
        selectedDate &&
        (isViewingEvents ? (
          <ViewEventsModal
            visible={isModalVisible}
            selectedDate={selectedDate}
            token={localStorage.getItem('token')!}
            events={viewingEvents}
            onClose={handleModalCancel}
          />
        ) : (
          <EventModal
            visible={isModalVisible}
            selectedDate={selectedDate}
            token={localStorage.getItem('token')!}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
          />
        ))}
    </div>
  );
};

export default Calendar;
