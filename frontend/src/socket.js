import { io } from 'socket.io-client';

const socket = io('https://liveops-backend-xn38.onrender.com');

export default socket;