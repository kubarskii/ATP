// TODO
// [X] Make ATP Central System boilerplate / 2
// [ ] Make cache for beacons              / 5
// [ ] Make schemas for ATP                / 3
// [X] Make scheme validator               / 5

require('dotenv').config();
import CentralSystem from './core/CentralSystem';
import Database from "./db/Database";
import {db as dbConf} from './config'

export const db = new Database(dbConf);
db.init();

const centralSystem = new CentralSystem({
    validateConnection: async (url: any) => {
        const urlCleared = url.replace('/', '');
        const bcn = await db.get(['/beacons']);
        return !!(bcn[urlCleared]);
    }
});
centralSystem.listen();


