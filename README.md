# @avidian/form-data

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

FormData with extra powers.

## Installation

npm:

```bash
npm install @avidian/form-data
```

yarn:

```bash
yarn add @avidian/form-data
```

## Usage

```javascript
import FormData from '@avidian/form-data';

const object = {
    key: 'value',
};

const formData = new FormData(object, ?options, ?prefix);

// or

formData.serialize(object, ?options, ?prefix)
```

## Credits

[Parmesh Krishen's](https://github.com/therealparmesh) [object-to-form-data](https://github.com/therealparmesh/object-to-formdata) package.
