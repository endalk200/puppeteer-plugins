[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs) [![react hooks test CI](https://github.com/endalk200/puppeteer-plugins/actions/workflows/test-ci.yml/badge.svg)](https://github.com/endalk200/puppeteer-plugins/actions/workflows/test-ci.yml) [![NPM](https://img.shields.io/npm/v/puppeteer-plugins)](https://www.npmjs.com/package/puppeteer-plugins) [![NPM](https://img.shields.io/npm/dm/puppeteer-plugins)](https://www.npmjs.com/package/puppeteer-plugins)

# Puppeteer Plugins

puppeteer plugins is a collection of helper functions and plugins for puppeteer. The package contains plugins that extend puppeteer functionality. It will make working with sites using puppeteer easier.

## Installation

```bash
npm install puppeteer-plugins
# or
yarn add puppeteer-plugins
```

## API

### 1. `_type`

The `_type` helper function is wrapper for puppeteer `type` API. It has additional features and safeguards that puppeteer doesn't offer out of the box. It has validation feature built in. It will first try to find the element with the given selector within the given timeout. If it can not find it will throw `ElementNotFoundError`. If it finds the element it will type in the given data and validate the inputs value to make sure it has been typed in.

```typescript
import { _type } from "puppeteer-plugins";

await _type({ page: page, selector: "input[name='firstName']", data: "John" });

await _type({
    pageOrFrame: page,
    selector: "input[name='lastName']",
    data: "Doe",
    expectedValue: "Doe",
    delay: 500,
});
```

### 2. `_select`

The `_select` helper function is wrapper for the puppeteer `select` API with additional features and safeguards. This helper functions sets the select value either using the select options `value` or `innerText`

```typescript
import { _select } from "puppeteer-plugins";

await _select({
    pageOrFrame: page,
    selector: "select[name=favoriteFramework]",
    value: "REACT",
});

await _select({
    pageOrFrame: page,
    selector: "select[name=favoriteFramework]",
    value: "React",
    text: "React",
});
```

### 3. `_setValue`

`_setValue` is helper function that can handle `input`, `textarea` and `select` HTML elements. It will figure out what the HTML element is and perform the action accordingly

```typescript
import { _setValue } from "puppeteer-plugins";

await _setValue({ pageOrFrame: page, selector: "input[name='lastName']", data: "Doe" });

await _setValue({
    pageOrFrame: page,
    selector: "select[name=favoriteFramework]",
    data: "REACT",
});
```

### 4. `_getFrame`

Working with `iframes` in puppeteer can be a little bit tricky. This helper function makes working with `iframes` very easy.

```typescript
import { _getFrame } from "puppeteer-plugins";

const frame = await _getFrame({
    selector: "iframe[name='main-frame']",
    pageOrFrame: page,
});

// You can also get nested frames
const outerFrame = await _getFrame({
    selector: "iframe[name='outer-frame']",
    pageOrFrame: page,
});
const innerFrame = await _getFrame({
    selector: "iframe[name='inner-frame']",
    pageOrFrame: outerFrame,
});

// Or you can do it at once like this

const nestedFrame = await _getFrame({
    selector: "iframe[name='inner-frame']",
    pageOrFrame: await _getFrame({
        selector: "iframe[name='outer-frame']",
        pageOrFrame: page,
    }),
});
```

## NOTE:

There more plugins and helper functions coming to this package. Stay tuned.
