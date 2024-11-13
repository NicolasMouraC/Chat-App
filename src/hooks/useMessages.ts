import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import MessageType from "../types/messages/MessageType";
import { User } from "firebase/auth";

export const useMessages = (chatId: string, currentUser: User | null) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!chatId) return;
    const chatRef = doc(db, "chats", chatId);

    const unsubscribe = onSnapshot(chatRef, async (snapshot) => {
      const chatData = snapshot.data();
      const updatedMessages = chatData?.messages.map((msg: MessageType) => ({
        ...msg,
        status: {
          ...msg.status,
          delivered: msg.senderId !== currentUser?.uid || msg.status.delivered,
          read: msg.senderId !== currentUser?.uid || msg.status.read,
        },
      }));
      setMessages(updatedMessages);

      if (updatedMessages !== undefined) {
        await updateDoc(chatRef, { messages: updatedMessages });
      }
    });

    return () => unsubscribe();
  }, [chatId, currentUser?.uid]);

  return messages;
};
