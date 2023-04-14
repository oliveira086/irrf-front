import { io } from 'socket.io-client';

const URL = 'https://api.centralderetencao.com.br';

export const socket = io(URL);
  