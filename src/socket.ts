import socket from 'socket.io-client'
import {server} from '../app.json'
export const io = socket(server)