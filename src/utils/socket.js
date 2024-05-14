// eslint-disable-next-line
import { io, Socket as SocketObject } from 'socket.io-client'

class Socket {
  /** @type {SocketObject} */
  static #instance

  static get instance() {
    Socket.#validateConnection()
    return Socket.#instance
  }

  static connect() {
    if (!Socket.#instance) {
      Socket.#instance = io('ws://localhost:3001')
    }
  }

  static disconnect() {
    if (Socket.#instance) {
      Socket.#instance.disconnect()
    }
  }

  static #validateConnection() {
    if (!Socket.#instance) {
      throw new Error('[Socket]: Socket connection has not been established')
    }
  }
}

export default Socket
