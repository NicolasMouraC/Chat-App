import React, { useContext, useReducer } from "react";
import { ChatContext } from "./ChatContext";
import { AuthContext } from "./AuthContext";
import ChatState from "../types/chat/ChatState";
import ChatAction from "../types/chat/ChatAction";

export const ChatContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useContext(AuthContext)!;

  const INITIAL_STATE: ChatState = {
    chatId: "null",
    user: null,
  };

  const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
      case "CHANGE_USER":
        if (!currentUser) throw new Error("currentUser is not available");
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
