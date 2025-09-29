import { useEffect, useRef, useState } from 'react';
import type { Message, Room, User } from '../../assets/type';
import ChatRoomNav from '../../components/nav/chatRoomNav';
import '../../App.css';

const LOCAL_STORAGE_MESSAGES_KEY = 'chat_messages';

interface ChatRoomProps {
  room: Room;
  me: User;
}

const ChatRoom = ({ room, me }: ChatRoomProps) => {
  const [inputValue, setInputValue] = useState('');

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(
      `${LOCAL_STORAGE_MESSAGES_KEY}_${room.id}`
    );
    if (saved) {
      return JSON.parse(saved);
    }
    return room.messages; // localStorage 없으면 더미 메시지
  });

  // 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem(
      `${LOCAL_STORAGE_MESSAGES_KEY}_${room.id}`,
      JSON.stringify(messages)
    );
  }, [messages, room.id]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      text: content,
      sender: me,
      timestamp: Date.now(),
      chatRoomId: '1',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
  };

  return (
    <div className="w-[375px] h-[728px] flex flex-col bg-[#DEE6F5]">
      {/* 상단 네비 */}
      <ChatRoomNav room={room} />

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto mb-2 p-2 no-scrollbar">
        {messages.map((msg, index) => {
          const nextMsg = messages[index + 1];
          const showTime =
            !nextMsg ||
            nextMsg.sender.id !== msg.sender.id ||
            new Date(nextMsg.timestamp).getMinutes() !==
              new Date(msg.timestamp).getMinutes();
          // const prevMsg = messages[index - 1];
          // const showTime =
          // !prevMsg ||
          // prevMsg.sender.id !== msg.sender.id ||
          const date = new Date(msg.timestamp);
          let hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const period = hours < 12 ? '오전' : '오후';
          hours = hours % 12 || 12;
          const timeStr = `${period} ${hours}:${minutes}`;

          // 날짜 관련 처리
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
          const weekday = weekdays[date.getDay()];
          const dateStr = `${month}월 ${day}일 (${weekday})`;

          const prevMsg = messages[index - 1];
          const prevDate = prevMsg
            ? new Date(prevMsg.timestamp).toDateString()
            : null;
          const showDate = prevDate !== date.toDateString(); // 이전 메시지와 날짜가 다르면 표시

          const isMe = msg.sender.id === me.id;
          const avatar =
            msg.sender.profileImageUrl || '/src/assets/profile.svg'; // 기본 이미지

          return (
            <div>
              {showDate && (
                <div className="flex justify-center my-2">
                  <div className="text-[11px] font-normal text-[#FFFFFF] bg-[#12121233] rounded-[16px] px-3 py-1 pl-[8px] pr-[8px] pt-[4px] pb-[4px]">
                    {dateStr}
                  </div>
                </div>
              )}
              <div
                key={msg.id}
                className={`my-1 flex ${
                  isMe ? 'justify-end' : 'justify-start'
                }  ${index === messages.length - 1 ? 'mb-[40px]' : 'mb-[0px]'}`}
              >
                <div
                  className={`flex items-end space-x-1 mb-[5px] ${
                    isMe ? 'flex-row-reverse space-x-reverse' : ''
                  } max-w-[262px]`}
                >
                  {/* 아바타 (상대방일 때만 표시) */}
                  {!isMe && (
                    <img
                      src={avatar}
                      alt={msg.sender.name}
                      className="w-[32px] h-[32px] mr-[5px] mb-[30px] ml-[10px]"
                    />
                  )}
                  <div>
                    {!isMe && (
                      <div className="text-[13px] mb-[8px]">
                        {msg.sender.name}
                      </div>
                    )}
                    {/* 메시지 박스 */}
                    <div className="bg-[rgba(255,255,255,1)] rounded-[12px] box-border break-words text-[14px] leading-[1.5] p-[8px] mr-[16px] mt-[0px] ">
                      {msg.text}
                    </div>
                  </div>

                  {/* 시간 */}
                  {showTime && (
                    <span className="text-[9px] text-[#7A7F8A] ml-[-8px] mr-[8px] whitespace-nowrap">
                      {timeStr}
                    </span>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 입력 영역 */}
      <div className="h-[56px] flex p-2 bg-[rgba(255,255,255,1)]">
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full mr-2 cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="ml-[10px] mr-[10px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.375 12C21.375 12.2984 21.2565 12.5845 21.0455 12.7955C20.8345 13.0065 20.5484 13.125 20.25 13.125H13.125V20.25C13.125 20.5484 13.0065 20.8345 12.7955 21.0455C12.5845 21.2565 12.2984 21.375 12 21.375C11.7016 21.375 11.4155 21.2565 11.2045 21.0455C10.9935 20.8345 10.875 20.5484 10.875 20.25V13.125H3.75C3.45163 13.125 3.16548 13.0065 2.9545 12.7955C2.74353 12.5845 2.625 12.2984 2.625 12C2.625 11.7016 2.74353 11.4155 2.9545 11.2045C3.16548 10.9935 3.45163 10.875 3.75 10.875H10.875V3.75C10.875 3.45163 10.9935 3.16548 11.2045 2.9545C11.4155 2.74353 11.7016 2.625 12 2.625C12.2984 2.625 12.5845 2.74353 12.7955 2.9545C13.0065 3.16548 13.125 3.45163 13.125 3.75V10.875H20.25C20.5484 10.875 20.8345 10.9935 21.0455 11.2045C21.2565 11.4155 21.375 11.7016 21.375 12Z"
                fill="#878C95"
              />
            </svg>
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지를 입력"
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage(inputValue);
            }}
            className="w-[251px] h-[20px] p-[10px] rounded-[16px] flex-1 px-2 py-1.5 bg-[#F1F2F3] border-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={() => sendMessage(inputValue)}
          className="ml-[10px] px-4 py-1.5 bg-inherit border-none text-white rounded-md"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.9244 10.3577L6.16875 1.3671C5.83656 1.18101 5.45558 1.10048 5.0765 1.1362C4.69741 1.17193 4.33819 1.32222 4.04661 1.56709C3.75502 1.81195 3.5449 2.13979 3.44419 2.507C3.34348 2.8742 3.35695 3.26336 3.48282 3.62272L6.31219 12.0002L3.48282 20.3777C3.38334 20.6603 3.35305 20.9627 3.39447 21.2594C3.43589 21.5562 3.54782 21.8387 3.72088 22.0832C3.89394 22.3278 4.12309 22.5274 4.38914 22.6652C4.65519 22.803 4.95039 22.875 5.25 22.8752C5.5722 22.8745 5.88885 22.7913 6.16969 22.6333L6.17813 22.6277L21.9281 13.6212C22.2169 13.4577 22.4571 13.2205 22.6243 12.9338C22.7914 12.6472 22.8795 12.3213 22.8795 11.9894C22.8795 11.6576 22.7914 11.3317 22.6243 11.045C22.4571 10.7584 22.2169 10.5212 21.9281 10.3577H21.9244ZM5.92407 20.1808L8.30719 13.1252H13.5C13.7984 13.1252 14.0845 13.0067 14.2955 12.7957C14.5065 12.5847 14.625 12.2986 14.625 12.0002C14.625 11.7019 14.5065 11.4157 14.2955 11.2047C14.0845 10.9937 13.7984 10.8752 13.5 10.8752H8.30719L5.92313 3.81772L20.2444 11.9899L5.92407 20.1808Z"
              fill="#878C95"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
