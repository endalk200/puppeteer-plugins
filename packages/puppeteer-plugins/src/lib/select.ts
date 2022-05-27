import { Page, Frame, TimeoutError } from "puppeteer";
import { ElementNotFoundError } from "./errors";
import { runIfFn } from "./utils";

export type SelectArgs = {
    /** The page or frame instance to reference */
    pageOrFrame: Page | Frame;

    /** The selector to use to find the element */
    selector: string;

    /** The select value to set */
    value: string | (() => string);

    /**
     * Text value or innerHTML to use instead of value. If you provide this argument
     * the value will be ignored and the text will be used instead.
     * */
    text?: string | (() => string);

    /**
     * The expected value of the input field. This used for validation. Defaults to `value`
     * If text is provided the text will be used instead of value for validation
     * */
    expectedValue?: string | (() => string);

    /** The delay between keystrokes in milliseconds. Defaults to `0` */
    delay?: number;

    /** The timeout in milliseconds. Defaults to `5000` */
    timeout?: number;
};

export const _select = async (args: SelectArgs) => {
    const { expectedValue, pageOrFrame, delay, text, timeout } = args;

    const __timeout = timeout ? timeout : 5000;
    const __delay = delay ? delay : 0;

    const __expectedValue: string | (() => string) = expectedValue
        ? expectedValue
        : args.value;

    try {
        await pageOrFrame.waitForSelector(args.selector, { timeout: __timeout });
    } catch (error) {
        if (error instanceof TimeoutError) {
            throw new ElementNotFoundError(args.selector);
        }

        throw new ElementNotFoundError(args.selector);
    }

    if (text) {
        await pageOrFrame.$eval(
            args.selector,
            (element: HTMLSelectElement, text: string) => {
                for (let index = 0; index < element.options.length; index++) {
                    if (element.options[index].innerText === text) {
                        element.options[index].selected = true;

                        /**
                         * After selecting the option manually dispatch change event to trigger
                         * any validation the page might have.
                         * */
                        element.dispatchEvent(new Event("change"));
                        element.blur();

                        if (element.options[index].innerText === text) {
                            break;
                        } else {
                            throw new Error(`Could not find option with text "${text}"`);
                        }
                    }
                }
            },
            runIfFn(text)
        );
    } else {
        await pageOrFrame.select(args.selector, runIfFn(args.value));

        const actual_value: string = await pageOrFrame.$eval(
            args.selector,
            (element: HTMLSelectElement) => element.value
        );

        if (actual_value !== runIfFn(__expectedValue)) {
            await pageOrFrame.$eval(
                args.selector,
                (element: HTMLSelectElement, value: string) => {
                    for (let index = 0; index < element.options.length; index++) {
                        if (element.options[index].value === value) {
                            element.options[index].selected = true;

                            /**
                             * After selecting the option manually dispatch change event to trigger
                             * any validation the page might have.
                             * */
                            element.dispatchEvent(new Event("change"));
                            element.blur();

                            if (element.options[index].value === value) {
                                break;
                            } else {
                                throw new Error(
                                    `Could not find option with value "${value}"`
                                );
                            }
                        }
                    }
                },
                runIfFn(args.value)
            );
        }
    }
};
