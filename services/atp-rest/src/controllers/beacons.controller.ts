import 'reflect-metadata';
import { Body, Controller, OnUndefined, Param, Post, Req } from 'routing-controllers';
import { createClient, sendRPCMessage } from '../services/amqpClient.service';

@Controller('/client')
export class BeaconsController {
  private channel: any = null;

  @OnUndefined(404)
  @Post('/:name')
  async callWSServer(@Body() body: any, @Param('name') name: string) {
    if (this.channel === null) {
      this.channel = await createClient({ url: 'amqp://localhost' });
    }
    this.channel.responseEmitter.on('event', () => {});
    const message = await sendRPCMessage(this.channel, JSON.stringify({ name, payload: body }), 'atp-service');
    return message ? JSON.parse(message.toString()) : undefined;
  }
}
