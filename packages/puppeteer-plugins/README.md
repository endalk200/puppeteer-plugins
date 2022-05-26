[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs) [![react hooks test CI](https://github.com/endalk200/puppeteer-plugins/actions/workflows/test-ci.yml/badge.svg)](https://github.com/endalk200/puppeteer-plugins/actions/workflows/test-ci.yml)

# Puppeteer Plugins

puppeteer plugins is a collection of helper functions and plugins for puppeteer. The package contains plugins that extend puppeteer functionality. It will make working with sites using puppeteer easier.

## Installation

```bash
npm install puppeteer-plugins

# or

yarn add puppeteer-plugins
```

## API

1. `_type`: This function will validate if the element is present in the DOM and type in the passed value
2. `_select`: This function wraps puppeteers `select` function. This function can work using both the value and innerText of the options.
3. `_setValue`: This helper function will handle all HTML input types. It will manually set the value of built in type API fails.
