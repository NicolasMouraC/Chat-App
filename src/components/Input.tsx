import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage, rtdb } from "../firebase";
import { ref, onValue } from "firebase/database";
import { v4 as uuid } from "uuid";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import MessageType from "../types/messages/MessageType";

const Input: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);

  const authContext = useContext(AuthContext);
  const chatContext = useContext(ChatContext);

  if (!authContext || !chatContext) {
    throw new Error("Contexts are not available");
  }

  const { currentUser } = authContext;
  const { data } = chatContext;

  const handleSend = async () => {
    if (!data.chatId || !currentUser?.uid) {
      console.error("No chat selected or user is not authenticated.");
      return;
    }

    const messageId = uuid();
    const messageData: MessageType = {
      id: messageId,
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      status: { sent: true, delivered: false, read: false },
    };

    try {
      const recipientId = data.user?.uid;

      const recipientStatusRef = ref(
        rtdb,
        `users/${recipientId}/status/online`
      );
      onValue(
        recipientStatusRef,
        (snapshot) => {
          const isOnline = snapshot.val();
          if (isOnline) {
            messageData.status.delivered = true;
          }
        },
        { onlyOnce: true }
      );

      if (img) {
        const imageRef = storageRef(storage, messageId);
        const uploadTask = uploadBytesResumable(imageRef, img);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => console.error("Error uploading image:", error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            messageData.img = downloadURL;

            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion(messageData),
            });
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion(messageData),
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files ? e.target.files[0] : null)}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
