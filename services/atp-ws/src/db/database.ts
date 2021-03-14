// @ts-ignore
import * as admin from 'firebase-admin';

interface DatabaseService {
  create: (arguments_: any) => any;
  get: (arguments_: any) => any;
  update: (arguments_: any) => any;
  delete: (arguments_: any) => any;
}

export default class Database implements DatabaseService {
  private config;

  private db: any;

  constructor(config: any) {
    this.config = config;
  }

  init() {
    admin.initializeApp({
      // @ts-ignore
      credential: admin.credential.cert(this.config.credential),
      databaseURL: this.config.url,
    });
    this.db = admin.database();
  }

  create(arguments_: any): any {
    const [referencePath, data] = arguments_;
    const reference = this.db.ref(referencePath);
    reference.push(data);
  }

  delete(arguments_: any): any {}

  get(arguments_: any): Promise<any> {
    const [referencePath] = arguments_;
    const reference = this.db.ref(referencePath);
    return new Promise<any>(res => {
      reference.on(
        'value',
        (snapshot: any) => {
          res(snapshot.val());
        },
        (errorObject: any) => {
          console.log(`The read failed: ${errorObject.code}`);
        },
      );
    });
  }

  update(arguments_: any): any {}
}
