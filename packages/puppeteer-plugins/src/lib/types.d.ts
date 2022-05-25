export type TypeProps = {
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
