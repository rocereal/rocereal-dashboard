export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isMine: boolean;
}

export interface MessengerChatProps {
  selectedContact: string | null;
}

// Mock messages data
export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      content: "Hey! How are you doing?",
      timestamp: "2024-01-15T10:30:00Z",
      isMine: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "Hi Alice! I'm doing great, thanks for asking. How about you?",
      timestamp: "2024-01-15T10:31:00Z",
      isMine: true,
    },
    {
      id: "3",
      senderId: "1",
      content:
        "I'm good too! Just working on some projects. Have you seen the new design updates?",
      timestamp: "2024-01-15T10:32:00Z",
      isMine: false,
    },
    {
      id: "4",
      senderId: "me",
      content: "Yes, I love the new color scheme! The gradients look amazing.",
      timestamp: "2024-01-15T10:33:00Z",
      isMine: true,
    },
  ],
  "2": [
    {
      id: "1",
      senderId: "2",
      content: "Thanks for your help with the project yesterday!",
      timestamp: "2024-01-15T09:15:00Z",
      isMine: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "No problem at all! Glad I could help.",
      timestamp: "2024-01-15T09:16:00Z",
      isMine: true,
    },
  ],
  "3": [
    {
      id: "1",
      senderId: "3",
      content: "See you tomorrow for the meeting!",
      timestamp: "2024-01-14T16:45:00Z",
      isMine: false,
    },
  ],
  "4": [
    {
      id: "1",
      senderId: "4",
      content: "The project is coming along nicely. Should be done by Friday.",
      timestamp: "2024-01-14T14:20:00Z",
      isMine: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "Great! Looking forward to seeing the final result.",
      timestamp: "2024-01-14T14:21:00Z",
      isMine: true,
    },
  ],
};

// Mock contacts data for avatars
export const mockContacts = [
  { id: "1", name: "Alice Johnson", avatar: "/avatars/alice.jpg" },
  { id: "2", name: "Bob Smith", avatar: "/avatars/bob.jpg" },
  { id: "3", name: "Carol Davis", avatar: "/avatars/carol.jpg" },
  { id: "4", name: "David Wilson", avatar: "/avatars/david.jpg" },
];
