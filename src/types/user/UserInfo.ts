import { User as FirebaseUser } from "firebase/auth";

interface UserInfo extends FirebaseUser {
  displayName: string;
  photoURL: string;
}

export default UserInfo;
