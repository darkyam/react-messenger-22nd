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
