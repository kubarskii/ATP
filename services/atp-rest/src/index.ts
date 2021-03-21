import { createExpressServer } from 'routing-controllers';
import { BeaconsController } from './controllers/beacons.controller';

const port = 3080;
const app = createExpressServer({
  controllers: [BeaconsController], // we specify controllers we want to use
});

app.listen(port, () => console.log(`Running on port ${port}`));
