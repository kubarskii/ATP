import { Channel, connect } from 'amqplib';
import EventEmitter from 'events';
import { v4 } from 'uuid';

interface CustomChannel extends Channel {
  responseEmitter?: EventEmitter;
  correlationId?: string;
}

const REPLY_QUEUE = 'ATP-REST';

const createClient = async (setting?: any) => {
  const connection = await connect('amqp://localhost');
  const channel: CustomChannel = await connection.createChannel();
  // creating queue if no one exists
  await channel.assertQueue('ATP-REST');
  channel.responseEmitter = new EventEmitter();
  channel.responseEmitter.setMaxListeners(0);
  await channel.consume(
    REPLY_QUEUE,
    (message: any) => {
      try {
        if (channel.responseEmitter && channel.correlationId) {
          channel.responseEmitter.emit(channel.correlationId, message.content.toString());
        } else {
          throw new Error('correlationId or responseEmitter is undefined');
        }
      } catch (error) {
        console.log(error);
      }
    },
    {
      noAck: true,
    },
  );
  return channel;
};

const sendRPCMessage = (channel: any, message: any, rpcQueue: string) => {
  return new Promise(resolve => {
    const correlationId = v4();
    channel.responseEmitter.once(`${correlationId}`, resolve);
    channel.correlationId = `${correlationId}`;
    channel.sendToQueue(rpcQueue, Buffer.from(message, 'utf-8'), { replyTo: REPLY_QUEUE });
  });
};

module.exports.createClient = createClient;
module.exports.sendRPCMessage = sendRPCMessage;
