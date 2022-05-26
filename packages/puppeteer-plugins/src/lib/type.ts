import { TimeoutError } from "puppeteer";
import type { Page, Frame } from "puppeteer";

import { ElementNotFoundError, InputValidationError } from "./errors";
import { runIfFn } from "./utils";

export type TypeArgs = {
    /** The page or frame instance to reference */
    pageOrFrame: Page | Frame;

    /** The selector to use to find the element */
    selector: string;

    /** The text to type into the element */
    data: string | (() => string);

    /** The expected value of the input field. This used for validation. Defaults to `data` */
    expectedValue?: string | (() => string);

    /** The delay between keystrokes in milliseconds. Defaults to `0` */
    delay?: number;

    /** The timeout in milliseconds. Defaults to `5000` */
    timeout?: number;
};

/**
 * Utility function to type into an input field. Has built in validation to ensure the input field
 * has the expected value.
 *
 * @param args
 */
export const _type = async (args: TypeArgs) => {
    const { expectedValue, pageOrFrame, delay, timeout } = args;

    const __timeout = timeout ? timeout : 5000;
    const __delay = delay ? delay : 0;

    const __expectedValue: string | (() => string) = expectedValue
        ? expectedValue
        : args.data;

    try {
        await pageOrFrame.waitForSelector(args.selector, { timeout: __timeout });
    } catch (error) {
        if (error instanceof TimeoutError) {
            throw new ElementNotFoundError(args.selector);
        }

        throw new ElementNotFoundError(args.selector);
    }

    await pageOrFrame.type(args.selector, runIfFn(args.data), { delay: __delay });

    const actual_value: string = await pageOrFrame.$eval(
        args.selector,
        (element: HTMLInputElement) => element.value
    );

    if (actual_value !== runIfFn(__expectedValue)) {
        throw new InputValidationError(runIfFn(__expectedValue), actual_value);
    }
};
