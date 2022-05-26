import { runIfFn } from "./utils";

/**
 * InputValidationError is an error thrown when the type operation fails to
 * set the input value to the expected value.
 */
export class InputValidationError extends Error {
    constructor(
        expectedValue: string | (() => string),
        actualValue: string | (() => string)
    ) {
        super(
            `Expected input value of "${runIfFn(expectedValue)}" but got "${runIfFn(
                actualValue
            )}"`
        );

        this.name = "InputValidationError";
    }

    getSource() {
        return `InputValidationError thrown from puppeteer-plugins`;
    }

    getMessage() {
        return this.message;
    }
}

export class ElementNotFoundError extends Error {
    constructor(selector: string) {
        super(`Element with selector "${selector}" not found for given timeout period`);

        this.name = "ElementNotFoundError";
    }

    getSource() {
        return `ElementNotFoundError thrown from puppeteer-plugins`;
    }

    getMessage() {
        return this.message;
    }
}

export class UnsupportedHTMLTag extends Error {
    constructor(tag: string) {
        super(`Unsupported HTML tag: ${tag}`);
    }

    getSource() {
        return `UnsupportedHTMLTag thrown from puppeteer-plugins`;
    }

    getMessage() {
        return this.message;
    }
}
