// TODO
// [X] Make ATP Central System boilerplate / 2
// [ ] Make cache for beacons              / 5
// [ ] Make schemas for ATP                / 3
// [X] Make scheme validator               / 5
// [ ] Make service registry               / 7

import axios from 'axios';
import { connect } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import CentralSystem from './core/CentralSystem';
import Database from './db/database';
import { db as databaseConfig } from './config';

export const databaseInstance = new Database(databaseConfig);
databaseInstance.init();

const registerService = async () => {
  const response: any = await axios.put('http://localhost:3090/register/atp-ws/1.0.0/9001').catch(error => {
    console.log(error);
  });
  return response?.data;
};

// TODO unregister on process error
const unregisterService = async () => {
  await axios.delete(`http://localhost:3090/register/atp-ws/1.0.0/9001`).catch((error: any) => {
    console.error(error);
  });
};

setInterval(registerService, 30 * 1000);

const centralSystem = new CentralSystem({
  validateConnection: async (url: any) => {
    const urlCleared = url.replace('/', '');
    const bcn = await databaseInstance.get(['/beacons']);
    return !!bcn[urlCleared];
  },
});

centralSystem.listen(registerService);

const q = 'atp-service';

connect('amqp://localhost')
  .then(conn => conn.createChannel())
  .then((channel: any) =>
    channel.assertQueue(q).then(() =>
      channel.consume(q, async (message: any) => {
        if (message !== null) {
          let qm;
          try {
            qm = JSON.parse(message.content.toString());
          } catch (error) {
            console.log(error);
          }
          await processQueueMessage(qm);
          channel.ack(message);
        }
      }),
    ),
  )
  .catch(error => {
    console.log(error);
  });

async function processQueueMessage(qm: any) {
  const connection = await connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('ATP-REST');
  const message = JSON.stringify({ status: 'Accepted' });
  return channel.sendToQueue('ATP-REST', Buffer.from(message, 'utf-8'));
}
