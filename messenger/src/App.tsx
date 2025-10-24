import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ChatRoom from './pages/chat/chatRoom';
import Home from '@pages/home/home';
import Chat from '@pages/chat/chat';

import usersData from '@assets/data/user.json';
import roomsData from '@assets/data/room.json';

import type { RawRoom, Room, User } from '@assets/type';
import { useState } from 'react';

function App() {
  const me = usersData.find((u) => u.id === 'me') as User;
  const friendsList = usersData.filter((u) => u.id !== 'me') as User[];

  const userMap = Object.fromEntries(usersData.map((u: User) => [u.id, u]));

  const [rooms, setRooms] = useState<Room[]>(() => {
    return (roomsData as RawRoom[]).map((r) => {
      const savedMessages = localStorage.getItem(`chat_messages_${r.id}`);
      return {
        id: r.id,
        name: r.name,
        members: r.memberIds.map((id) => userMap[id]),
        messages: savedMessages
          ? JSON.parse(savedMessages)
          : r.messages.map((m) => ({
              id: m.id,
              sender: userMap[m.senderId],
              text: m.text,
              timestamp: m.timestamp,
              chatRoomId: r.id,
            })),
      };
    });
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home me={me} friendsList={friendsList} />} />
        <Route path="/chat" element={<Chat rooms={rooms} />} />
        <Route
          path="/chat/:roomId"
          element={<ChatRoom rooms={rooms} me={me} setRooms={setRooms} />}
        />
        {/* <ChatRoom room={dummyRoom} me={me} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
