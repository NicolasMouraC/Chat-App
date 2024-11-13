import { createContext, useContext } from "react";
import ChatType from "../types/chat/ChatType";

export const ChatContext = createContext<ChatType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("ChatProvider Error");
  }
  return context;
};
