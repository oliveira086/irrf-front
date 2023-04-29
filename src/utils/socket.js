import { io } from 'socket.io-client';

const URL = 'https://api-dev.cefitem.net';

export const socket = io(URL);
  