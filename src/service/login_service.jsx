import { useCallback } from "react";
import { useSocket } from "../socket";

export function useAuthActions() {
  const { socket, storage } = useSocket();

  const loginUser = useCallback(
    async (userName, phoneNumber) => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("LOGIN", { userName, phoneNumber }, (response) => {
          if (response && response.success) {
            storage.setItem("userId", response.user.userId);
          }
          resolve(response);
        });
      });
    },
    [socket, storage]
  );

  const register = useCallback(
    async (userName, phoneNumber) => {
      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("REGISTER", { userName, phoneNumber }, (response) => {
          if (response && response.userId) {
            storage.setItem("userId", response.userId);
            resolve(response);
          }
          resolve(response);
        });
      });
    },
    [socket, storage]
  );

  return { loginUser, register };
}
