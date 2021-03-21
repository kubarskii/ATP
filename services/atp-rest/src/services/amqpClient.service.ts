import { connect } from 'amqplib';
import EventEmitter from 'events';
import { v4 } from 'uuid';

const REPLY_QUEUE = 'ATP-REST';

const createClient = (setting?: any) =>
  connect('amqp://localhost')
    .then((conn: any) => conn.createChannel()) // create channel
    .then((channel: any) => {
      channel.responseEmitter = new EventEmitter();
      channel.responseEmitter.setMaxListeners(0);
      channel.consume(
        REPLY_QUEUE,
        (message: any) => {
          try {
            channel.responseEmitter.emit(channel.correlationId, message.content.toString());
          } catch (error) {
            console.log(error);
          }
        },
        {
          noAck: true,
        },
      );
      return channel;
    });

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
