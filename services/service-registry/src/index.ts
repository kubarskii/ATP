import { createExpressServer } from 'routing-controllers';
import { RegistryController } from './controllers/registry.controller';

const port = 3090;
const app = createExpressServer({
  controllers: [RegistryController], // we specify controllers we want to use
});

app.listen(port, () => console.log(`Running on port ${port}`));
