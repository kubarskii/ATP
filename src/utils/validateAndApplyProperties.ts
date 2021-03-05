const Enjoi = require('enjoi');

const MODEL_VALUES_SYMBOL = Symbol('modelValues');

export default function validateAndApplyProperties(object: any, schema: any, payload: any = {}) {
    validate(schema, payload)
    object[MODEL_VALUES_SYMBOL] = {};
    const properties: any = {};
    for (let key in schema.properties) {
        object[MODEL_VALUES_SYMBOL][key] = payload[key];
        properties[key] = {
            get: () => object[MODEL_VALUES_SYMBOL][key],
            set: (val: any) => {
                validate(schema.properties[key], val);
                (val === undefined) ? (delete object[MODEL_VALUES_SYMBOL][key]) : (object[MODEL_VALUES_SYMBOL][key] = val);
            },
            enumerable: true,
            configurable: false
        };
    }
    Object.defineProperties(object, properties);
}

function validate(schema: any, val: any) {
    const valSchema = Enjoi.schema(schema);
    const {error} = valSchema.validate(val);
    if (error) {
        throw new Error(error);
    }
}

export function getObjectValues (object: any) {
    const values = { ...(object[MODEL_VALUES_SYMBOL] || {}) };

    for (let key in values) {
        if (!values.hasOwnProperty(key)) {
            return;
        }
        if (values[key] === undefined) {
            delete values[key];
        }
    }
    return object[MODEL_VALUES_SYMBOL];
}