import { EventEmitter } from 'events';
import { Socket } from 'net';

export class TCPHelper extends EventEmitter {
  client: Socket;

  /**
   * Creates a TCP socket to the given host and port.
   * @param {string} host
   * @param {number} port
   */
  constructor(host: string, port: number) {
    super();

    this.client = new Socket();

    this.client.on('data', (data) => this.emit('data', data));
    this.client.on('error', (error) => this.emit('error', error));
    this.client.on('close', () => this.emit('close'));

    this.client.connect(port, host, () => this.emit('connect'));
  }

  /**
   * Writes a given message to the TCP stream with newline as the ending char
   * @param {message} message – the message to be written
   * @param {boolean} getResponseUntilClose – whether to respond with a promise that is resolved on socket close or not
   */
  send(message: string, getResponseUntilClose = false): Promise<Buffer | null> {
    if (!this.client.writable) throw Error('Socket is not writable');
    this.client.write(`${message}\r\n`);

    if (getResponseUntilClose) {
      return new Promise((resolve) => {
        const buffers: Buffer[] = [];
        this.on('data', (data) => buffers.push(data as Buffer));
        this.on('close', () => resolve(Buffer.concat(buffers)));
      });
    }

    return Promise.resolve(null);
  }
}
