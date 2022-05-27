import { Frame, Page } from "puppeteer";

export type GetFrameArgs = {
    selector: string;

    /** The page or frame to get the frame from */
    pageOrFrame: Page | Frame;

    /** The timeout in milliseconds. Defaults to `5000` */
    timeout?: number;
};

export const _getFrame = async (args: GetFrameArgs): Promise<Frame> => {
    const { selector, pageOrFrame } = args;

    const __timeout = args.timeout ? args.timeout : 5000;

    await pageOrFrame.waitForSelector(selector, { timeout: __timeout, visible: true });

    const frameHandle = await pageOrFrame.$(selector);

    return await frameHandle.contentFrame();
};
