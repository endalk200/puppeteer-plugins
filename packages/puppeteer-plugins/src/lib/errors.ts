import { runIfFn } from "./utils";

/**
 * @public
 */
export class CustomError extends Error {
    errorCode: string;

    constructor(message?: string) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * InputValidationError is an error thrown when the type operation fails to
 * set the input value to the expected value.
 */
export class InputValidationError extends CustomError {
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
        this.errorCode = "INPUT_VALIDATION_ERROR";
    }

    getSource() {
        return `InputValidationError thrown from puppeteer-plugins`;
    }

    getMessage() {
        return this.message;
    }
}

export class ElementNotFoundError extends CustomError {
    constructor(selector: string) {
        super(`Element with selector "${selector}" not found for given timeout period`);

        this.name = "ElementNotFoundError";
        this.errorCode = "ELEMENT_NOT_FOUND_ERROR";
    }

    getSource() {
        return `ElementNotFoundError thrown from puppeteer-plugins`;
    }

    getMessage() {
        return this.message;
    }
}

export class UnsupportedHTMLTag extends CustomError {
    constructor(tag: string) {
        super(`Unsupported HTML tag: ${tag}`);

        this.name = "UnsupportedHTMLTag";
        this.errorCode = "UNSUPPORTED_HTML_TAG";
    }

    getSource() {
        return `UnsupportedHTMLTag thrown from puppeteer-plugins`;
    }

    getMessage() {
        return this.message;
    }
}
