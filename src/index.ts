function isUndefined(value: any): value is undefined {
    return value === undefined;
}

const isNull = (value: any) => value === null;

const isBoolean = (value: any) => typeof value === 'boolean';

const isObject = (value: any) => value === Object(value);

function isArray(value: any): value is Array<any> {
    return Array.isArray(value);
}

const isDate = (value: any) => value instanceof Date;

const isBlob = (value: any) =>
    value && typeof value.size === 'number' && typeof value.type === 'string' && typeof value.slice === 'function';

export type FormDataOptions = {
    indices?: boolean;
    nullsAsUndefineds?: boolean;
    booleansAsIntegers?: boolean;
    allowEmptyArrays?: boolean;
};

const isFile = (value: any) =>
    isBlob(value) &&
    typeof value.name === 'string' &&
    (typeof value.lastModifiedDate === 'object' || typeof value.lastModified === 'number');

export default class FormData extends window.FormData {
    constructor(data?: HTMLFormElement | Record<string, any>, options?: FormDataOptions, keyPrefix?: string) {
        if (data) {
            if (data instanceof HTMLFormElement) {
                super(data);
            } else {
                super();
                this.serialize(data, options, keyPrefix);
            }
        } else {
            super();
        }
    }

    serialize<T>(obj: T, cfg?: FormDataOptions, pre?: string) {
        cfg = cfg || {};

        cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices;

        cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds) ? false : cfg.nullsAsUndefineds;

        cfg.booleansAsIntegers = isUndefined(cfg.booleansAsIntegers) ? false : cfg.booleansAsIntegers;

        cfg.allowEmptyArrays = isUndefined(cfg.allowEmptyArrays) ? false : cfg.allowEmptyArrays;

        if (isUndefined(obj)) {
            return this;
        } else if (isNull(obj)) {
            if (!cfg.nullsAsUndefineds) {
                this.append(pre!, '');
            }
        } else if (isBoolean(obj)) {
            if (cfg.booleansAsIntegers) {
                this.append(pre!, (obj ? 1 : 0) as any);
            } else {
                this.append(pre!, obj as any);
            }
        } else if (isArray(obj)) {
            if (obj.length) {
                obj.forEach((value, index) => {
                    const key = pre + '[' + (cfg?.indices ? index : '') + ']';

                    this.serialize(value, cfg, key);
                });
            } else if (cfg.allowEmptyArrays) {
                this.append(pre + '[]', '');
            }
        } else if (isDate(obj)) {
            this.append(pre!, (obj as any).toISOString());
        } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
            Object.keys(obj).forEach((prop) => {
                const value = (obj as any)[prop];

                if (isArray(value)) {
                    while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
                        prop = prop.substring(0, prop.length - 2);
                    }
                }

                const key = pre ? pre + '[' + prop + ']' : prop;

                this.serialize(value, cfg, key);
            });
        } else {
            this.append(pre!, obj as any);
        }

        return this;
    }
}
