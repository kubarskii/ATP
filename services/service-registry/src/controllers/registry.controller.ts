import { Body, Controller, Delete, Get, OnUndefined, Param, Put, Req } from 'routing-controllers';
import 'reflect-metadata';
import { ServiceRegistryService } from '../services/serviceRegistry.service';

const registry = new ServiceRegistryService({ timeout: 60 });

@Controller('')
export class RegistryController {
  @Get('/find/:name/:version')
  @OnUndefined(404)
  getService(@Req() r: any, @Param('name') name: string, @Param('version') version: string) {
    const service = registry.getService(name, version);
    return service;
  }

  @Put('/register/:name/:version/:port')
  registerService(
    @Req() request: any,
    @Param('name') name: string,
    @Param('version') version: string,
    @Param('port') port: number,
  ) {
    const ip = request.connection.remoteAddress.includes('::')
      ? `[${request.connection.remoteAddress}]`
      : request.connection.remoteAddress;
    const key = registry.registerService(name, version, ip, port);
    return key;
  }

  @Delete('/register/:name/:version/:port')
  deleteService(@Param('name') name: string, @Param('version') version: string, @Param('port') port: number) {
    const ip = '';
    registry.unregister(name, version, ip, port);
  }
}
