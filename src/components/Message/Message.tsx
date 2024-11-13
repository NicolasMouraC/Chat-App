import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { formatDistanceToNow } from "date-fns";
import MessageType from "../../types/messages/MessageType";
import { MessageStatus } from "./MessageStatus";

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);
  const messageDate = new Date(message.date.seconds * 1000);
  const messageTime = formatDistanceToNow(messageDate, { addSuffix: true });

  if (!authContext || !chatContext) {
    throw new Error("Contexts are not available");
  }

  const { currentUser } = authContext;
  const { data } = chatContext;

  return (
    <div
      className={`message ${
        message.senderId === currentUser?.uid ? "owner" : ""
      }`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser?.uid
              ? currentUser?.photoURL || ""
              : data.user?.photoURL || ""
          }
          alt=""
        />
        <span className="messageTime">{messageTime}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
        {message.senderId !== currentUser?.uid ? null : (
          <MessageStatus status={message.status} />
        )}
      </div>
    </div>
  );
};

export default Message;
