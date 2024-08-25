import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const storage =
  process.env.NODE_ENV === "production" ? localStorage : sessionStorage;

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketIo = io.connect(BASE_URL);

    // 연결 성공 시
    socketIo.on("connect", () => {
      console.log("Socket connected:", socketIo.id);
    });

    // 연결 해제 시
    socketIo.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    // 연결 오류 시
    socketIo.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, storage }}>
      {children}
    </SocketContext.Provider>
  );
};
