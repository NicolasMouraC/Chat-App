import { User } from "firebase/auth";

interface ChatAction {
  type: string;
  payload: User;
}

export default ChatAction;
