import socket from "./socket";
 export async function wordInput(userId, roomId, trimmedInput) {
    return new Promise((resolve, reject) => {
        socket.emit('WORD', { userId, roomId, word: trimmedInput }, (response) => {
            if (response.success) {
                console.log("Word submitted successfully");
                resolve(response); // 성공 시 응답을 resolve
            } else {
                console.error("Failed to submit word");
                reject(new Error("Failed to submit word")); // 실패 시 에러를 reject
            }
        });
    });
}


