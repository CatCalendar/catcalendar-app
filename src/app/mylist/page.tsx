'use client'; // 클라이언트 전용 컴포넌트임을 명시

import React from 'react';
import '../../styles/pages/mylist.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

// 동적 페이지에 적용
export const dynamic = 'force-dynamic';

const MyList: React.FC = () => {
  const events = useSelector(
    (state: RootState) => state.events?.events || []
  );

  const today = new Date();
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= today;
  });

  // 날짜별로 이벤트를 그룹화하는 함수
  const groupByDate = (events: typeof upcomingEvents) => {
    return events.reduce(
      (
        acc: { [key: string]: typeof upcomingEvents },
        event
      ) => {
        const eventDate = new Date(event.date)
          .toISOString()
          .split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
        if (!acc[eventDate]) {
          acc[eventDate] = [];
        }
        acc[eventDate].push(event);
        return acc;
      },
      {}
    );
  };

  const groupedEvents = groupByDate(upcomingEvents);

  // 날짜를 오름차순으로 정렬
  const sortedDates = Object.keys(groupedEvents).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // 요일을 가져오는 함수
  const getDayOfWeek = (dateString: string) => {
    const daysOfWeek = [
      '일',
      '월',
      '화',
      '수',
      '목',
      '금',
      '토',
    ];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  // 요일에 따른 스타일을 적용하는 함수
  const getDateStyle = (dateString: string) => {
    const day = new Date(dateString).getDay();
    if (day === 0) {
      // 일요일
      return { color: 'rgb(255, 129, 129)' };
    } else if (day === 6) {
      // 토요일
      return { color: 'rgb(81, 127, 255)' };
    } else {
      // 평일
      return {};
    }
  };

  return (
    <div className="page-container">
      <h1>남은 일정들!</h1>
      {sortedDates.length > 0 ? (
        sortedDates.map((date, index) => (
          <div key={index} className="event-container">
            <h2
              style={{
                margin: 0,
                marginBottom: 5,
                ...getDateStyle(date),
              }}
            >
              {date} ({getDayOfWeek(date)})
            </h2>
            <ul
              style={{
                padding: 0,
                marginLeft: 10,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              {groupedEvents[date]
                .sort(
                  (a, b) =>
                    new Date(
                      `${a.date}T${a.time}`
                    ).getTime() -
                    new Date(
                      `${b.date}T${b.time}`
                    ).getTime()
                )
                .map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="daily-container"
                  >
                    <div className="text-container">
                      <span className="time-text">
                        {event.time}
                      </span>
                      <span className="title-text">
                        {event.title}
                      </span>
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
          </div>
        ))
      ) : (
        <p>일정이 없어요 !!</p>
      )}
    </div>
  );
};

export default MyList;
