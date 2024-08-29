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
  const [isConnected, setIsConnected] = useState(false); // 연결 상태 관리

  useEffect(() => {
    const socketIo = io.connect(BASE_URL);

    // 연결 성공 시
    socketIo.on("connect", () => {
      console.log("Socket connected:", socketIo.id);
      setIsConnected(true); // 연결 상태 업데이트
    });

    // 연결 해제 시
    socketIo.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false); // 연결 상태 업데이트
    });

    // 연결 오류 시
    socketIo.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false); // 연결 상태 업데이트
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, storage, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
