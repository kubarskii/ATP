export function BindMethod(target: any, key: string, descriptor: PropertyDescriptor) {
  let $function = descriptor.value;

  let definingProperty = false;

  return {
    configurable: true,
    get() {
      if (
        definingProperty
        || this === target.prototype
        || this.hasOwnProperty(key)
        || typeof $function !== 'function'
      ) {
        return $function;
      }

      const boundFunction = $function.bind(this);
      definingProperty = true;
      Object.defineProperty(this, key, {
        configurable: true,
        get() {
          return boundFunction;
        },
        set(value) {
          $function = value;
          delete this[key];
        },
      });
      definingProperty = false;
      return boundFunction;
    },
    set(value: any) {
      $function = value;
    },
  };
}
