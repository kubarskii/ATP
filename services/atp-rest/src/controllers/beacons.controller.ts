import { Body, Controller, OnUndefined, Param, Post, Req } from 'routing-controllers';
import 'reflect-metadata';

const amqpClient = require('../services/amqpClient.service');

@Controller('/client')
export class BeaconsController {
  private channel: any = null;

  @Post('/:name')
  async callWSServer(@Body() body: any, @Param('name') name: string) {
    if (this.channel === null) {
      this.channel = await amqpClient.createClient({ url: 'amqp://localhost' });
    }
    this.channel.responseEmitter.on('event', () => {});
    const message = await amqpClient.sendRPCMessage(
      this.channel,
      JSON.stringify({ name, payload: body }),
      'atp-service',
    );
    const parsedMessage = message ? JSON.parse(message.toString()) : undefined;
    return parsedMessage;
  }
}
