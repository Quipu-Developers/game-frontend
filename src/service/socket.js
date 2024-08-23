import io from "socket.io-client";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const socket = io.connect(BASE_URL);

export default socket;
