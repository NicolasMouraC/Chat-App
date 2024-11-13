import { User } from "firebase/auth";

interface ChatState {
  chatId: string;
  user: User | null;
}

export default ChatState;
