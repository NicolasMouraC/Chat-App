import { render, screen } from "@testing-library/react";
import Message from "../components/Message/Message";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { User } from "firebase/auth";
import MessageType from "../types/messages/MessageType";

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

const currentUserMock: User = {
  uid: "user123",
  displayName: "Current User",
  email: "user123@example.com",
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: "2022-01-01T00:00:00Z",
    lastSignInTime: "2022-01-01T00:00:00Z",
  },
  providerData: [],
  refreshToken: "fake-refresh-token",
  tenantId: "tenant123",
  delete: jest.fn(),
  getIdToken: jest.fn().mockResolvedValue("fake-token"),
  getIdTokenResult: jest.fn().mockResolvedValue({ token: "fake-id-token" }),
  reload: jest.fn(),
  toJSON: jest.fn().mockReturnValue({}),
  phoneNumber: "+1234567890",
  photoURL: "http://example.com/photo.jpg",
  providerId: "firebase",
};

const chatContextMock = {
  dispatch: jest.fn(),
  data: {
    chatId: "chat123",
    user: {
      uid: "user456",
      displayName: "User 456",
      email: "user456@example.com",
      emailVerified: true,
      isAnonymous: false,
      metadata: {
        creationTime: "2022-01-01T00:00:00Z",
        lastSignInTime: "2022-01-01T00:00:00Z",
      },
      providerData: [],
      refreshToken: "fake-refresh-token",
      tenantId: "tenant123",
      delete: jest.fn(),
      getIdToken: jest.fn().mockResolvedValue("fake-token"),
      getIdTokenResult: jest.fn().mockResolvedValue({ token: "fake-id-token" }),
      reload: jest.fn(),
      toJSON: jest.fn().mockReturnValue({}),
      phoneNumber: "+0987654321",
      photoURL: "http://example.com/photo456.jpg",
      providerId: "firebase",
    },
  },
};

const authContextMock = {
  currentUser: currentUserMock,
  handleLogout: jest.fn(),
};

describe("Message Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should show a single tick when message is sent", async () => {
    const messageMock: MessageType = {
      id: "message123",
      senderId: "user123",
      text: "Hello, World!",
      date: { seconds: 1672531199, nanoseconds: 123456789 },
      status: { sent: true, delivered: false, read: false },
    };

    render(
      <AuthContext.Provider value={authContextMock}>
        <ChatContext.Provider value={chatContextMock}>
          <Message message={messageMock} />
        </ChatContext.Provider>
      </AuthContext.Provider>
    );

    const singleTick = screen.getByTestId("single-tick");
    expect(singleTick).toBeInTheDocument();
  });
});
