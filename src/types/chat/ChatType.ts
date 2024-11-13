import ChatState from "./ChatState";
import ChatAction from "./ChatAction";
import { Dispatch } from "react";

interface ChatType {
  data: ChatState;
  dispatch: Dispatch<ChatAction>;
}

export default ChatType;
