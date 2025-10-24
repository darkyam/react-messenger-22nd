import type { Room } from '@assets/type';
import { BottomNavChat } from '@components/nav/bottomNav';
import { ChatTopNav } from '@components/nav/homeTopNav';
import { useNavigate } from 'react-router-dom';
import Search from '@assets/search_bar.svg';

interface ChatProps {
  rooms: Room[];
}

const Chat = ({ rooms }: ChatProps) => {
  const navigate = useNavigate();
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    const aLast = a.messages[a.messages.length - 1]?.timestamp || 0;
    const bLast = b.messages[b.messages.length - 1]?.timestamp || 0;
    return bLast - aLast; // 최신 메시지가 있는 방이 위로
  });

  return (
    <div className="relative bg-white w-[375px] h-[728px]">
      <ChatTopNav />
      <img src={Search} />
      <div className="mt-[5px] pb-[60px]">
        {sortedRooms.map((room) => {
          const lastMessage = [...room.messages].sort(
            (a, b) => b.timestamp - a.timestamp
          )[0];

          return (
            <div
              key={room.id}
              onClick={() => navigate(`/chat/${room.id}`)}
              className="flex items-center px-4 py-3 hover:bg-gr-50 transition cursor-pointer"
            >
              <img
                src={
                  room.members[1]?.profileImageUrl ||
                  '/assets/104px_profile.svg'
                }
                alt={room.name}
                className="w-[44px] h-[44px] rounded-[16px] object-cover mr-3"
              />

              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="body-large-md">{room.name}</span>
                  {lastMessage && (
                    <span className="caption-medium-rg text-gr-800">
                      {formatTime(lastMessage.timestamp)}
                    </span>
                  )}
                </div>

                <p className="text-gr-900 caption-medium-rg truncate">
                  {lastMessage ? `${lastMessage.text}` : '메시지가 없습니다.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <BottomNavChat />
    </div>
  );
};

export default Chat;
