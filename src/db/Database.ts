import * as admin from 'firebase-admin';

interface DatabaseService {
    create: (args: any) => any,
    get: (args: any) => any,
    update: (args: any) => any,
    delete: (args: any) => any,
}

export default class Database implements DatabaseService {
    private config;
    private db: any;

    constructor(config: any) {
        this.config = config
    }

    init() {
        admin.initializeApp({
            // @ts-ignore
            credential: admin.credential.cert(this.config.credential),
            databaseURL: this.config.url,
        });
        this.db = admin.database();
    }

    create(args: any): any {
        const [refPath, data] = args;
        const ref = this.db.ref(refPath);
        ref.push(data);
    }

    delete(args: any): any {
    }

    get(args: any): Promise<any> {
        const [refPath] = args;
        const ref = this.db.ref(refPath);
        return new Promise<any>(res => {
            ref.on("value", (snapshot: any) => {
                res(snapshot.val());
            }, (errorObject: any) => {
                console.log("The read failed: " + errorObject.code);
            });
        })
    }

    update(args: any): any {
    }

}