export interface User {
  id: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface Message {
  id: string;
  sender: User;
  text: string;
  timestamp: number;
  chatRoomId: string;
}

export interface Room {
  id: string;
  name: string;
  members: User[];
  messages: Message[];
}

export interface RawMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface RawRoom {
  id: string;
  name: string;
  memberIds: string[];
  messages: RawMessage[];
}
