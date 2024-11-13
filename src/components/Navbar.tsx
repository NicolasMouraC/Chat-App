import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser, handleLogout } = useContext(AuthContext)!;

  return (
    <div className="navbar">
      <span className="logo">Chat App</span>
      <div className="user">
        {currentUser ? (
          <>
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || "User Avatar"}
              />
            ) : (
              <div className="default-avatar">No Avatar</div>
            )}
            <span>{currentUser.displayName || "Anonymous"}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span>No user logged in</span>
        )}
      </div>
    </div>
  );
};

export default Navbar;
