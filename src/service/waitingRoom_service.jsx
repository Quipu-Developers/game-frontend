import { useCallback } from "react";
import { useSocket } from "../socket";

export function useWaitingRoomActions() {
  const socket = useSocket();

  const sendMessage = useCallback(
    (roomId, message) => {
      return new Promise((resolve, reject) => {
        const userId = localStorage.getItem("userId");
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("CHAT", { userId, roomId, message }, (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error("Failed to send message"));
          }
        });
      });
    },
    [socket]
  );

  const startGame = useCallback(
    (roomId) => {
      return new Promise((resolve, reject) => {
        const userId = localStorage.getItem("userId");
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("STARTGAME", { userId, roomId }, (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error("Failed to start game"));
          }
        });
      });
    },
    [socket]
  );

  const kickMember = useCallback(
    (roomId, targetId) => {
      return new Promise((resolve, reject) => {
        const userId = localStorage.getItem("userId");
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("KICKMEMBER", { userId, roomId, targetId }, (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error("Failed to kick member"));
          }
        });
      });
    },
    [socket]
  );

  const deleteRoom = useCallback(
    (roomId) => {
      return new Promise((resolve, reject) => {
        const userId = localStorage.getItem("userId");
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("DELETEROOM", { roomId, userId }, (response) => {
          if (response.success) {
            resolve();
          } else {
            reject(new Error("Failed to delete room"));
          }
        });
      });
    },
    [socket]
  );

  return { sendMessage, startGame, kickMember, deleteRoom };
}
