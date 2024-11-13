import { act, render, screen } from "@testing-library/react";
import Chats from "../components/Chats";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { User } from "firebase/auth";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  onSnapshot: jest.fn((docRef, callback) => {
    callback({
      data: () => ({
        chatId: "chat123",
        messages: [],
      }),
    });
    return jest.fn();
  }),
  updateDoc: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(() => ({})),
  ref: jest.fn(),
  onValue: jest.fn((_, callback) => {
    callback({
      val: () => ({
        user456: { status: { online: true }, displayName: "User 456" },
        user789: { status: { online: true }, displayName: "User 789" },
      }),
    });
    return jest.fn(() => {
      callback({
        val: () => ({
          user456: { status: { online: false }, displayName: "User 456" },
          user789: { status: { online: true }, displayName: "User 789" },
        }),
      });
    });
  }),
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
      photoURL: "http://example.com/photo456.jpg",
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
      providerId: "firebase",
    },
  },
};

const authContextMock = {
  currentUser: currentUserMock,
  handleLogout: jest.fn(),
};

describe("Chats Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display online users and update when they go offline", async () => {
    const { rerender } = render(
      <AuthContext.Provider value={authContextMock}>
        <ChatContext.Provider value={chatContextMock}>
          <Chats />
        </ChatContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText("User 456")).toBeInTheDocument();

    await act(async () => {
      const users = {
        user456: { status: { online: false }, displayName: "User 456" },
        user789: { status: { online: true }, displayName: "User 789" },
      };

      jest.fn().mockImplementation(() => {
        callback({
          val: () => users,
        });
      });
    });

    rerender(
      <AuthContext.Provider value={authContextMock}>
        <ChatContext.Provider value={chatContextMock}>
          <Chats />
        </ChatContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText("User 456")).toBeInTheDocument();
  });
});
function callback(arg0: {
  val: () => {
    user456: { status: { online: boolean }; displayName: string };
    user789: { status: { online: boolean }; displayName: string };
  };
}) {
  throw new Error("Function not implemented.");
}
