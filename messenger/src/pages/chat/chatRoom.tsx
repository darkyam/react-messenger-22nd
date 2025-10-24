import { useEffect, useRef, useState } from 'react';
import type { Message, Room, User } from '../../assets/type';
import ChatRoomNav from '../../components/nav/chatRoomNav';
import profile from '../../assets/profile.svg';
import { useParams } from 'react-router-dom';
import SendIcon from '@assets/icon-1.svg';
import PlusIcon from '@assets/icon.svg';
import EmojiIcon from '@assets/imoji.svg';

const LOCAL_STORAGE_MESSAGES_KEY = 'chat_messages';

interface ChatRoomProps {
  me: User;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}

const ChatRoom = ({ rooms, me, setRooms }: ChatRoomProps) => {
  const { roomId } = useParams<{ roomId: string }>();
  const room = rooms.find((r) => r.id === roomId);

  // room 없으면 렌더링 안함
  if (!room) return <div>채팅방을 찾을 수 없습니다.</div>;

  const [inputValue, setInputValue] = useState('');

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(
      `${LOCAL_STORAGE_MESSAGES_KEY}_${room.id}`
    );
    return saved ? JSON.parse(saved) : room.messages;
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 메시지 변경 시 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem(
      `${LOCAL_STORAGE_MESSAGES_KEY}_${room.id}`,
      JSON.stringify(messages)
    );
  }, [messages, room.id]);

  // 메시지 스크롤
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
      chatRoomId: room.id,
    };

    setMessages((prev) => [...prev, newMessage]);

    // App의 rooms 상태도 업데이트
    setRooms((prevRooms) =>
      prevRooms.map((r) =>
        r.id === room.id ? { ...r, messages: [...r.messages, newMessage] } : r
      )
    );

    setInputValue('');
  };

  return (
    <div className="w-[375px] h-[728px] flex flex-col bg-[#DEE6F5]">
      <ChatRoomNav room={room} />

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto mb-q pl-2 pr-2 no-scrollbar">
        {messages.map((msg, index) => {
          const isMe = msg.sender.id === me.id;
          const date = new Date(msg.timestamp);

          const nextMsg = messages[index + 1];
          const showTime =
            !nextMsg ||
            nextMsg.sender.id !== msg.sender.id ||
            new Date(nextMsg.timestamp).getMinutes() !== date.getMinutes();

          // 날짜 표시
          const prevMsg = messages[index - 1];
          const showDate =
            !prevMsg ||
            new Date(prevMsg.timestamp).toDateString() !== date.toDateString();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
          const weekday = weekdays[date.getDay()];
          const dateStr = `${month}월 ${day}일 (${weekday})`;

          let hours = date.getHours();
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const period = hours < 12 ? '오전' : '오후';
          hours = hours % 12 || 12;
          const timeStr = `${period} ${hours}:${minutes}`;

          const avatar = msg.sender.profileImageUrl || profile;

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex justify-center mt-[15px]">
                  <div className="text-[11px] font-normal text-[#FFFFFF] bg-[#12121233] rounded-[16px] px-3 py-1">
                    {dateStr}
                  </div>
                </div>
              )}
              <div
                className={`my-1 mb-[10px] flex ${
                  isMe ? 'justify-end' : 'justify-start'
                } ${index === messages.length - 1 ? 'mb-[40px]' : ''}`}
              >
                <div
                  className={`flex items-end space-x-1 max-w-[262px] ${
                    isMe ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {!isMe && (
                    <img
                      src={avatar}
                      alt={msg.sender.name}
                      className="w-[32px] h-[32px] mr-[5px] mb-[30px] ml-[5px]"
                    />
                  )}
                  <div>
                    {!isMe && (
                      <div className="text-[13px] mb-[8px]">
                        {msg.sender.name}
                      </div>
                    )}
                    <div className="bg-[rgba(255,255,255,1)] rounded-[12px] box-border break-words text-[14px] leading-[1.5] p-[8px] mr-[5px] ">
                      {msg.text}
                    </div>
                  </div>
                  {showTime && (
                    <span className="text-[9px] text-[#7A7F8A] ml-[-3px] mr-[3px] whitespace-nowrap">
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
        <img src={PlusIcon} className="ml-[5px] mr-[10px]" />
        <div className="flex w-[271px] h-[40px] rounded-[16px] justify-between items-center bg-gr-50">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="메시지 입력"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputValue);
              }
            }}
            className="ml-[10px] no-scrollbar resize-none w-[247px] h-[24px] p-[10px] flex-1 px-2 py-1.5 bg-[#F1F2F3] border-none focus:outline-none"
          />
          <img src={EmojiIcon} className="mr-[10px]" />
        </div>
        <button
          onClick={() => sendMessage(inputValue)}
          className="ml-[15px] border-none"
        >
          <img src={SendIcon} />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
