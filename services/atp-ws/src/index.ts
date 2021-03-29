// TODO
// [X] Make ATP Central System boilerplate / 2
// [ ] Make cache for beacons              / 5
// [ ] Make schemas for ATP                / 3
// [X] Make scheme validator               / 5
// [ ] Make service registry               / 7

import axios from 'axios';
import { connect } from 'amqplib';
import CentralSystem, { clients } from './core/CentralSystem';
import { Client } from './core/Clients';
import Connection from './core/Connection';

const registerService = async () => {
  const response: any = await axios.put('http://localhost:3090/register/atp-ws/1.0.0/9001')
    .catch((error) => {
      console.log(error);
    });
  return response?.data;
};

// TODO unregister on process error
const unregisterService = async () => {
  await axios.delete('http://localhost:3090/register/atp-ws/1.0.0/9001')
    .catch((error: any) => {
      console.error(error);
    });
};

setInterval(registerService, 30 * 1000);

const centralSystem = new CentralSystem({
  validateConnection: async (url: any) => {
    const urlCleared = url.replace('/', '');
    return true;
  },
});

centralSystem.listen(() => {
  console.log('WS Server started on port 9001');
});

const queue = 'atp-service';

connect('amqp://localhost')
  .then((conn) => conn.createChannel())
  .then((channel: any) => channel.assertQueue(queue)
    .then(() => channel.consume(queue, async (message: any) => {
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
    })))
  .catch((error) => {
    console.log(error);
  });

async function processQueueMessage(qm: any) {
  const { name } = qm;
  const beacon: Client | undefined = clients.getClientByName(name);

  if (beacon) {
    const { connection }: { connection: Connection } = beacon;
    connection.sendRequest('Status', { payload: 'THIS IS TEST PAYLOAD' });
  }

  const connection = await connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue('ATP-REST');
  const message = JSON.stringify({ status: 'Accepted' });
  return channel.sendToQueue('ATP-REST', Buffer.from(message, 'utf-8'));
}
