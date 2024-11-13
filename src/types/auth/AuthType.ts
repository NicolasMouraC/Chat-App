import { User } from "firebase/auth";

interface AuthType {
  currentUser: User | null;
  handleLogout: () => void;
}

export default AuthType;
