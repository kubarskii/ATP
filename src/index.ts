// TODO
// [X] Make ATP Central System boilerplate / 2
// [ ] Make cache for beacons              / 5
// [ ] Make schemas for ATP                / 3
// [ ] Make scheme validator               / 5

import CentralSystem from './core/CentralSystem';

const centralSystem = new CentralSystem({
    validateConnection: (url: any) => {
        // check if CS name in DB
        return true;
    }
});
centralSystem.listen();