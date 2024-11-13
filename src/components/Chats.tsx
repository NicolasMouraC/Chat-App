import { doc, onSnapshot, DocumentData, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db, rtdb } from "../firebase";
import { ref, onValue } from "firebase/database";
import createChatIfNotExists from "../utils/createChatIfNotExists";

interface UserInfo extends FirebaseUser {
  displayName: string;
  photoURL: string;
}

interface Chat {
  userInfo: UserInfo;
  lastMessage?: { text: string };
  date: number;
  delivered: boolean;
}

const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserInfo[]>([]);
  const [usersWithoutChats, setUsersWithoutChats] = useState<UserInfo[]>([]);
  const { currentUser } = useContext(AuthContext)!;
  const { dispatch } = useContext(ChatContext)!;

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to user's chats in Firestore
    const unsubChats = onSnapshot(
      doc(db, "userChats", currentUser?.uid),
      (doc: DocumentData) => {
        const data = doc.data();
        if (data) {
          setChats(Object.values(data) as Chat[]);
        }
      }
    );

    // Subscribe to online users in Realtime Database
    const onlineUsersRef = ref(rtdb, "users");
    const unsubOnlineUsers = onValue(onlineUsersRef, (snapshot) => {
      const users = snapshot.val() || {};
      const onlineUsersList: UserInfo[] = Object.keys(users)
        .filter(
          (userId) =>
            users[userId].status?.online && userId !== currentUser?.uid
        )
        .map((userId) => ({ ...users[userId], uid: userId }));

      setOnlineUsers(onlineUsersList);
    });

    return () => {
      unsubChats();
      unsubOnlineUsers();
    };
  }, [currentUser]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data() as UserInfo;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
    return null;
  };

  useEffect(() => {
    const getUsersWithoutChats = async () => {
      const usersWithoutChatsList: UserInfo[] = [];

      for (const user of onlineUsers) {
        const userHasChat = chats.some(
          (chat) => chat.userInfo?.uid === user.uid
        );
        if (!userHasChat) {
          const userProfile = await fetchUserProfile(user.uid);
          if (userProfile) {
            usersWithoutChatsList.push(userProfile);
          }
        }
      }

      setUsersWithoutChats(usersWithoutChatsList);
    };

    if (onlineUsers.length > 0) {
      getUsersWithoutChats();
    }
  }, [onlineUsers, chats]);

  const handleSelect = (userInfo: UserInfo) => {
    createChatIfNotExists(userInfo, currentUser as UserInfo);
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((user) => user?.uid === userId);
  };

  const renderChat = (chat: Chat) => (
    <div
      className="userChat"
      key={chat.userInfo?.uid}
      onClick={() => handleSelect(chat.userInfo)}
    >
      <img src={chat?.userInfo?.photoURL} alt={chat?.userInfo?.displayName} />
      <div className="userChatInfo">
        <span>{chat.userInfo?.displayName}</span>
        <p>{chat.lastMessage?.text}</p>
        <span
          className={`status ${
            isUserOnline(chat?.userInfo?.uid) ? "online" : "offline"
          }`}
        ></span>
      </div>
    </div>
  );

  return (
    <div className="chats">
      <h3 className="chatSubMenu">Previous Chats</h3>
      {chats
        .filter((chat) => chat.userInfo?.uid)
        .sort((a, b) => b.date - a.date)
        .map(renderChat)}

      <h3 className="chatSubMenu">Online Users Without Chats</h3>
      {usersWithoutChats
        .filter(
          (user) => !chats.some((chat) => chat?.userInfo?.uid === user?.uid)
        )
        .map((user) => (
          <div
            className="userChat"
            key={user?.uid}
            onClick={() => handleSelect(user)}
          >
            <img src={user?.photoURL} alt={user?.displayName} />
            <div className="userChatInfo">
              <span>{user?.displayName}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
