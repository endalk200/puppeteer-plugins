import { Page, Frame, TimeoutError } from "puppeteer";

import { ElementNotFoundError, InputValidationError, UnsupportedHTMLTag } from "./errors";
import { runIfFn } from "./utils";

export type SetValueArgs = {
    /** The page or frame instance to reference */
    pageOrFrame: Page | Frame;

    /** The selector to use to find the element */
    selector: string;

    /**
     * The text to type into the element if it is of type INPUT and TEXTAREA,
     * If the HTML element is select it will be used as the value for the select element.
     * */
    data: string | (() => string);

    /**
     * The expected value of the input field. This used for validation. Defaults to `data`
     *
     * */
    expectedValue?: string | (() => string);

    /** The delay between keystrokes in milliseconds. Defaults to `0` */
    delay?: number;

    /** The timeout in milliseconds. Defaults to `5000` */
    timeout?: number;
};

export const _setValue = async (args: SetValueArgs) => {
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

    const tagName = await pageOrFrame.$eval(
        args.selector,
        (element: Element) => element.tagName
    );

    if (tagName === "INPUT") {
        await args.pageOrFrame.type(args.selector, runIfFn(args.data), {
            delay: __delay,
        });

        const actual_value: string = await pageOrFrame.$eval(
            args.selector,
            (element: HTMLInputElement) => element.value
        );

        if (actual_value !== runIfFn(__expectedValue)) {
            await pageOrFrame.click(args.selector);
            await pageOrFrame.focus(args.selector);
            await pageOrFrame.click(args.selector, { clickCount: 3 });

            if ("keyboard" in pageOrFrame) {
                await pageOrFrame.keyboard.press("Backspace");
            }

            await pageOrFrame.type(args.selector, runIfFn(args.data), { delay: __delay });

            // Verify that the input value is the same as the expected value if not throw an error
            const __actual_value = await pageOrFrame.$eval(
                args.selector,
                (element: HTMLInputElement) => element.value
            );

            if (__actual_value !== runIfFn(__expectedValue)) {
                throw new InputValidationError(runIfFn(__expectedValue), actual_value);
            }
        }
    } else if (tagName === "TEXTAREA") {
        await args.pageOrFrame.type(args.selector, runIfFn(args.data), {
            delay: __delay,
        });

        const actual_value: string = await args.pageOrFrame.$eval(
            args.selector,
            (element: HTMLInputElement) => element.value
        );

        if (actual_value !== runIfFn(__expectedValue)) {
            await pageOrFrame.click(args.selector);
            await pageOrFrame.focus(args.selector);
            await pageOrFrame.click(args.selector, { clickCount: 3 });

            if ("keyboard" in pageOrFrame) {
                await pageOrFrame.keyboard.press("Backspace");
            }

            await pageOrFrame.type(args.selector, runIfFn(args.data), { delay: __delay });

            // Verify that the input value is the same as the expected value if not throw an error
            const __actual_value = await pageOrFrame.$eval(
                args.selector,
                (element: HTMLInputElement) => element.value
            );

            if (__actual_value !== runIfFn(__expectedValue)) {
                throw new InputValidationError(runIfFn(__expectedValue), actual_value);
            }
        }
    } else {
        throw new UnsupportedHTMLTag(tagName);
    }
};
