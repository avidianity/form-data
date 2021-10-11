import FormData from '../src';

const formDataAppend = FormData.prototype.append;

beforeEach(() => {
    FormData.prototype.append = jest.fn(formDataAppend);
});

test('undefined', () => {
    const formData = new FormData({
        foo: undefined,
    });

    expect(formData.append).not.toHaveBeenCalled();
    expect(formData.get('foo')).toBe(null);
});

test('null', () => {
    const formData = new FormData({
        foo: null,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', '');
    expect(formData.get('foo')).toBe('');
});

test('null with nullsAsUndefineds option', () => {
    const formData = new FormData(
        {
            foo: null,
        },
        {
            nullsAsUndefineds: true,
        },
    );

    expect(formData.append).not.toHaveBeenCalled();
    expect(formData.get('foo')).toBe(null);
});

test('boolean', () => {
    const formData = new FormData({
        foo: true,
        bar: false,
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo', true);
    expect(formData.append).toHaveBeenNthCalledWith(2, 'bar', false);
    expect(formData.get('foo')).toBe('true');
    expect(formData.get('bar')).toBe('false');
});

test('boolean with booleansAsIntegers option', () => {
    const formData = new FormData(
        {
            foo: true,
            bar: false,
        },
        {
            booleansAsIntegers: true,
        },
    );

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo', 1);
    expect(formData.append).toHaveBeenNthCalledWith(2, 'bar', 0);
    expect(formData.get('foo')).toBe('1');
    expect(formData.get('bar')).toBe('0');
});

test('integer', () => {
    const formData = new FormData({
        foo: 1,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', 1);
    expect(formData.get('foo')).toBe('1');
});

test('float', () => {
    const formData = new FormData({
        foo: 1.01,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', 1.01);
    expect(formData.get('foo')).toBe('1.01');
});

test('string', () => {
    const formData = new FormData({
        foo: 'bar',
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', 'bar');
    expect(formData.get('foo')).toBe('bar');
});

test('empty string', () => {
    const formData = new FormData({
        foo: '',
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', '');
    expect(formData.get('foo')).toBe('');
});

test('Object', () => {
    const formData = new FormData({
        foo: {
            bar: 'baz',
            qux: 'quux',
        },
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[bar]', 'baz');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[qux]', 'quux');
    expect(formData.get('foo[bar]')).toBe('baz');
    expect(formData.get('foo[qux]')).toBe('quux');
});

test('empty Object', () => {
    const formData = new FormData({
        foo: {},
    });

    expect(formData.append).not.toHaveBeenCalled();
    expect(formData.get('foo')).toBe(null);
});

test('Object in Array', () => {
    const formData = new FormData({
        foo: [
            {
                bar: 'baz',
            },
            {
                qux: 'quux',
            },
        ],
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[][bar]', 'baz');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[][qux]', 'quux');
    expect(formData.get('foo[][bar]')).toBe('baz');
    expect(formData.get('foo[][qux]')).toBe('quux');
});

test('Object in Object', () => {
    const formData = new FormData({
        foo: {
            bar: {
                baz: {
                    qux: 'quux',
                },
            },
        },
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo[bar][baz][qux]', 'quux');
    expect(formData.get('foo[bar][baz][qux]')).toBe('quux');
});

test('Array', () => {
    const formData = new FormData({
        foo: ['bar', 'baz'],
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[]', 'bar');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[]', 'baz');
    expect(formData.getAll('foo[]')).toEqual(['bar', 'baz']);
});

test('empty Array', () => {
    const formData = new FormData({
        foo: [],
    });

    expect(formData.append).not.toHaveBeenCalled();
    expect(formData.get('foo')).toBe(null);
});

test('Array in Array', () => {
    const formData = new FormData({
        foo: [[['bar', 'baz']]],
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[][][]', 'bar');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[][][]', 'baz');
    expect(formData.getAll('foo[][][]')).toEqual(['bar', 'baz']);
});

test('Array in Object', () => {
    const formData = new FormData({
        foo: {
            bar: ['baz', 'qux'],
        },
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[bar][]', 'baz');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[bar][]', 'qux');
    expect(formData.getAll('foo[bar][]')).toEqual(['baz', 'qux']);
});

test('Array where key ends with "[]"', () => {
    const formData = new FormData({
        'foo[]': ['bar', 'baz'],
    });

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[]', 'bar');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[]', 'baz');
    expect(formData.getAll('foo[]')).toEqual(['bar', 'baz']);
});

test('Array with indices option', () => {
    const formData = new FormData(
        {
            foo: ['bar', 'baz'],
        },
        {
            indices: true,
        },
    );

    expect(formData.append).toHaveBeenCalledTimes(2);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[0]', 'bar');
    expect(formData.append).toHaveBeenNthCalledWith(2, 'foo[1]', 'baz');
    expect(formData.get('foo[0]')).toBe('bar');
    expect(formData.get('foo[1]')).toBe('baz');
});

test('Array with allowEmptyArrays option', () => {
    const formData = new FormData(
        {
            foo: [],
        },
        {
            allowEmptyArrays: true,
        },
    );

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenNthCalledWith(1, 'foo[]', '');
    expect(formData.get('foo[]')).toBe('');
});

test('Date', () => {
    const foo = new Date(2000, 0, 1, 1, 1, 1);
    const formData = new FormData({
        foo,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', foo.toISOString());
    expect(formData.get('foo')).toBe(foo.toISOString());
});

test('File', () => {
    const foo = new File([], '');
    const formData = new FormData({
        foo,
    });

    expect(formData.append).toHaveBeenCalledTimes(1);
    expect(formData.append).toHaveBeenCalledWith('foo', foo);
    expect(formData.get('foo')).toBe(foo);
});
