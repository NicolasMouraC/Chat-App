interface MessageType {
  id: string;
  text: string;
  img?: string;
  senderId: string;
  status: {
    sent: boolean;
    delivered: boolean;
    read: boolean;
  };
  date: {
    seconds: number;
    nanoseconds: number;
  };
}

export default MessageType;
