import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

interface UserInfo {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface Chat {
  userInfo: UserInfo;
  lastMessage?: { text: string };
  date: number;
  delivered: boolean;
}

export const useUserChats = (currentUserUid: string | undefined) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!currentUserUid) return;

    const unsubscribe = onSnapshot(
      doc(db, "userChats", currentUserUid),
      (snapshot) => {
        const data = snapshot.data();
        setChats(data ? (Object.values(data) as Chat[]) : []);
      }
    );

    return () => unsubscribe();
  }, [currentUserUid]);

  return chats;
};
