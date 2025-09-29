import './App.css';
import type { Room, User, Message } from './assets/type';
import ChatRoom from './pages/chat/chatRoom';

// 더미 유저
const me: User = { id: 'me', name: '나' };
const userA: User = { id: 'u1', name: '김건우' };
const userB: User = { id: 'u2', name: '조예원' };

// 더미 메시지
const dummyMessages: Message[] = [
  {
    id: 'm1',
    sender: userA,
    text: '안녕?',
    timestamp: Date.now() - 50000000000,
    chatRoomId: 'room1',
  },
  {
    id: 'm2',
    sender: userB,
    text: '오늘 뭐해?',
    timestamp: Date.now() - 5000,
    chatRoomId: 'room1',
  },
];

// 더미 채팅방
const dummyRoom: Room = {
  id: 'room1',
  name: 'Offnal v2',
  members: [me, userA, userB],
  messages: dummyMessages,
};

function App() {
  return (
    <>
      <ChatRoom room={dummyRoom} me={me} />
    </>
  );
}

export default App;
