import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import Message from "./Message/Message";
import { AuthContext } from "../context/AuthContext";
import { useMessages } from "../hooks/useMessages";

const Messages: React.FC = () => {
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);

  if (!authContext || !chatContext) {
    throw new Error("Contexts are not available");
  }

  const { currentUser } = authContext;
  const { data } = chatContext;

  const messages = useMessages(data?.chatId, currentUser);

  return (
    <div className="messages">
      {messages?.map((m, idx) => (
        <Message message={m} key={idx} />
      ))}
    </div>
  );
};

export default Messages;
