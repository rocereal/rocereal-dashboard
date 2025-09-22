import one from "@/app/assets/avatars/one.jpg";
import two from "@/app/assets/avatars/two.jpg";
import three from "@/app/assets/avatars/three.jpg";
import four from "@/app/assets/avatars/four.jpg";
import { StaticImageData } from "next/image";

export interface Contact {
  id: string;
  name: string;
  email?: string;
  avatar?: string | StaticImageData;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

// Mock contacts data
export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Bob Johnson",
    avatar: one,
    lastMessage: "Hey, how are you doing?",
    timestamp: "2024-01-15T10:30:00Z",
    unreadCount: 2,
    isOnline: true,
    email: "bob@johnson.com",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: two,
    lastMessage: "Thanks for the help!",
    timestamp: "2024-01-15T09:15:00Z",
    unreadCount: 0,
    isOnline: true,
    email: "bob@smith.com",
  },
  {
    id: "3",
    name: "Carol Davis",
    avatar: three,
    lastMessage: "See you tomorrow!",
    timestamp: "2024-01-14T16:45:00Z",
    unreadCount: 1,
    email: "carol@davis.com",
    isOnline: false,
  },
  {
    id: "4",
    name: "Shania Wilson",
    avatar: four,
    lastMessage: "The project is coming along nicely",
    timestamp: "2024-01-14T14:20:00Z",
    unreadCount: 0,
    isOnline: true,
    email: "shania@wilson.com",
  },
];
