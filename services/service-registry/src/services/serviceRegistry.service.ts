import { BindMethod } from '../../../../lib/decorators/bindMethod.decorator';
import { Singleton } from '../../../../lib/decorators/singleton.decorator';

@Singleton
export class ServiceRegistryService {
  private services: any = {};

  private timeout = 60;

  private config = {};

  private interval: any | undefined;

  constructor(config: { timeout?: number }) {
    this.config = config;
    this.timeout = config.timeout || this.timeout;
    this.init();
  }

  @BindMethod
  init() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.cleanup();
      }, this.timeout * 1000);
    }
  }

  @BindMethod
  cleanup(): void {
    const now = Math.floor(Date.now() / 1000);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(this.services)) {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
      }
    }
  }

  @BindMethod
  registerService(name: string, version: string, ip: string, port: number): string {
    const key = `${name} ${version} ${ip}:${port}`;
    if (!this.services[key]) {
      this.services[key] = {};
      const serviceDescription = {
        timestamp: Math.floor(Date.now() / 1000),
        ip,
        port,
        name,
        version,
      };
      this.services[key] = {
        ...serviceDescription,
      };
    }
    this.services[key] = {
      ...this.services[key],
      timestamp: Math.floor(Date.now() / 1000),
    };
    return key;
  }

  @BindMethod
  unregister(name: string, version: string, ip: string, port: number): string {
    const key = `${name} ${version} ${ip}:${port}`;
    delete this.services[key];
    return key;
  }

  @BindMethod
  getService(name: string, version: string) {
    const candidates = Object.values(this.services).filter((service: any) => {
      return service.name === name && service.version === version;
    });

    return candidates[Math.floor(Math.random() * candidates.length)];
  }
}
