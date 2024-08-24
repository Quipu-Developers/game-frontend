import { useSocket } from "../socket";

export function useGameActions() {
  const socket = useSocket();

  const wordInput = async (roomId, word) => {
    const userId = localStorage.getItem("userId");

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
  };

  return { wordInput };
}
