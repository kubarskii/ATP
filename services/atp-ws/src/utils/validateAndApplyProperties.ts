// eslint-disable-next-line @typescript-eslint/no-var-requires
const Enjoi = require('enjoi');

const MODEL_VALUES_SYMBOL = Symbol('modelValues');

export default function validateAndApplyProperties(object: any, schema: any, payload: any = {}) {
  validate(schema, payload);
  object[MODEL_VALUES_SYMBOL] = {};
  const properties: any = {};
  for (const key in schema.properties) {
    object[MODEL_VALUES_SYMBOL][key] = payload[key];
    properties[key] = {
      get: () => object[MODEL_VALUES_SYMBOL][key],
      set: (value: any) => {
        validate(schema.properties[key], value);
        if (value === undefined) {
          delete object[MODEL_VALUES_SYMBOL][key];
        } else {
          object[MODEL_VALUES_SYMBOL][key] = value;
        }
      },
      enumerable: true,
      configurable: false,
    };
  }
  Object.defineProperties(object, properties);
}

function validate(schema: any, value: any) {
  const valueSchema = Enjoi.schema(schema);
  const { error } = valueSchema.validate(value);
  if (error) {
    throw new Error(error);
  }
}

export function getObjectValues(object: any) {
  const values = { ...(object[MODEL_VALUES_SYMBOL] || {}) };

  for (const key in values) {
    if (!values.hasOwnProperty(key)) {
      return;
    }
    if (values[key] === undefined) {
      delete values[key];
    }
  }
  return object[MODEL_VALUES_SYMBOL];
}
