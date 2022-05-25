import * as puppeteer from "puppeteer";
import { ElementNotFoundError, InputValidationError } from "./errors";
import { runIfFn } from "./utils";

type TypeProps = {
    /** The page or frame instance to reference */
    pageOrFrame: puppeteer.Page | puppeteer.Frame;

    /** The selector to use to find the element */
    selector: string;

    /** The text to type into the element */
    data: string | (() => string);

    /** The expected value of the input field. This used for validation. Defaults to `data` */
    expectedValue?: string | (() => string);

    /** The delay between keystrokes in milliseconds. Defaults to `0` */
    delay?: number;
};

/**
 * Utility function to type into an input field. Has built in validation to ensure the input field
 * has the expected value.
 *
 * @param args
 */
export const _type = async (args: TypeProps) => {
    const { pageOrFrame, selector, expectedValue, data, delay } = args;

    try {
        await pageOrFrame.waitForSelector(selector, { timeout: 5000 });
    } catch (error) {
        if (error instanceof puppeteer.errors.TimeoutError) {
            throw new ElementNotFoundError(selector);
        }

        throw new ElementNotFoundError(selector);
    }

    await pageOrFrame.type(selector, runIfFn(data), { delay: delay });

    const actual_value: string = await pageOrFrame.$eval(
        selector,
        (element: HTMLInputElement) => element.value
    );

    if (actual_value !== (expectedValue ? expectedValue : data)) {
        throw new InputValidationError(
            () => (expectedValue ? `${runIfFn(expectedValue)}` : `${runIfFn(data)}`),
            actual_value
        );
    }
};
