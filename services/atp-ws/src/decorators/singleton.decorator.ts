export const SINGLETON_KEY = Symbol('singleton');

export type Singleton<T extends new (...arguments_: any[]) => any> = T & {
  [SINGLETON_KEY]: T extends new (...arguments_: any[]) => infer I ? I : never;
};

export const Singleton = <T extends new (...arguments_: any[]) => any>(type: T) => new Proxy(type, {
  // this will hijack the constructor
  construct(target: Singleton<T>, argumentsList, newTarget) {
    // we should skip the proxy for children of our target class
    if (target.prototype !== newTarget.prototype) {
      return Reflect.construct(target, argumentsList, newTarget);
    }
    // if our target class does not have an instance, create it
    if (!target[SINGLETON_KEY]) {
      target[SINGLETON_KEY] = Reflect.construct(target, argumentsList, newTarget);
    }
    // return the instance we created!
    return target[SINGLETON_KEY];
  },
});
