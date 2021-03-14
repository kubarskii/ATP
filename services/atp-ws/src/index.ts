// TODO
// [X] Make ATP Central System boilerplate / 2
// [ ] Make cache for beacons              / 5
// [ ] Make schemas for ATP                / 3
// [X] Make scheme validator               / 5

import CentralSystem from './core/CentralSystem';
import Database from './db/database';
import { db as databaseConfig } from './config';

export const db = new Database(databaseConfig);
db.init();

const centralSystem = new CentralSystem({
  validateConnection: async (url: any) => {
    const urlCleared = url.replace('/', '');
    const bcn = await db.get(['/beacons']);
    return !!bcn[urlCleared];
  },
});
centralSystem.listen();
