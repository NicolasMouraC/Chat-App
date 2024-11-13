import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import UserInfo from "../types/user/UserInfo";
import createChatIfNotExists from "../utils/createChatIfNotExists";

const Search: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [err, setErr] = useState<boolean>(false);

  const authContext = useContext(AuthContext);
  const { currentUser } = authContext ?? {};

  if (!authContext || !currentUser) {
    throw new Error("Contexts are not available");
  }

  const resetSearch = () => {
    setUser(null);
    setUsername("");
    setErr(false);
  };

  const handleSearch = async () => {
    if (!username.trim()) return;

    try {
      const userResult = await searchUserByName(username);
      if (userResult) {
        setUser(userResult);
        setErr(false);
      } else {
        setErr(true);
      }
    } catch (error) {
      setErr(true);
    }
  };

  const searchUserByName = async (name: string): Promise<UserInfo | null> => {
    const userQuery = query(
      collection(db, "users"),
      where("displayName", "==", name)
    );
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserInfo;
    }
    return null;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") handleSearch();
  };

  const handleSelectUser = async () => {
    if (user) {
      await createChatIfNotExists(user, currentUser as UserInfo);
      resetSearch();
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKeyDown}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelectUser}>
          <img src={user.photoURL || "default-avatar.png"} alt="User Avatar" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
