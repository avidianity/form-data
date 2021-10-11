export declare type FormDataOptions = {
    indices?: boolean;
    nullsAsUndefineds?: boolean;
    booleansAsIntegers?: boolean;
    allowEmptyArrays?: boolean;
};
export default class FormData extends window.FormData {
    constructor(data?: HTMLFormElement | Record<string, any>, options?: FormDataOptions, keyPrefix?: string);
    serialize<T>(obj: T, cfg?: FormDataOptions, pre?: string): this;
}
