import { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const chatContext = useContext(ChatContext);

  if (!chatContext) {
    throw new Error("ChatContext is not available");
  }

  const { data } = chatContext;

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName || "No User Selected"}</span>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
