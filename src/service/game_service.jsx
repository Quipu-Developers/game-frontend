import { useCallback } from "react";
import { useSocket } from "../socket";

export function useGameActions() {
  const { socket, storage } = useSocket();

  const wordInput = useCallback(
    async (roomId, word) => {
      const userId = storage.getItem("userId");

      return new Promise((resolve, reject) => {
        if (!socket) {
          reject(new Error("Socket is not connected"));
          return;
        }

        socket.emit("WORD", { userId, roomId, word }, (response) => {
          if (response.success) {
            console.log("Word submitted successfully");
            resolve(response);
          } else {
            console.error("Failed to submit word");
            reject(new Error("Failed to submit word"));
          }
        });
      });
    },
    [socket, storage]
  );

  return { wordInput };
}
