import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import UserInfo from "../types/user/UserInfo";

const getCombinedId = (id1: string, id2: string) =>
  id1 > id2 ? id1 + id2 : id2 + id1;

const checkChatExists = async (chatId: string) => {
  const chatDoc = await getDoc(doc(db, "chats", chatId));
  return chatDoc.exists();
};

const initializeChat = async (
  chatId: string,
  targetUser: UserInfo,
  currentUser: UserInfo
) => {
  await setDoc(doc(db, "chats", chatId), { messages: [] });
  await updateUserChats(currentUser.uid, chatId, targetUser);
  await updateUserChats(targetUser.uid, chatId, currentUser as UserInfo);
};

const updateUserChats = async (
  userId: string,
  chatId: string,
  otherUser: UserInfo
) => {
  await updateDoc(doc(db, "userChats", userId), {
    [`${chatId}.userInfo`]: {
      uid: otherUser.uid,
      displayName: otherUser.displayName,
      photoURL: otherUser.photoURL,
    },
    [`${chatId}.date`]: serverTimestamp(),
  });
};

const createChatIfNotExists = async (
  targetUser: UserInfo,
  currentUser: UserInfo
) => {
  const combinedId = getCombinedId(currentUser.uid, targetUser.uid);

  try {
    const chatExists = await checkChatExists(combinedId);
    if (!chatExists) {
      await initializeChat(combinedId, targetUser, currentUser);
    }
  } catch (error) {
    console.error("Error creating chat: ", error);
  }
};

export default createChatIfNotExists;
