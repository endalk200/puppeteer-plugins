import * as puppeteer from "puppeteer";

import { _setValue } from "./set-value";

describe("Test `_type` helper function", () => {
    const args: string[] = [
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-infobars",
        "--no-sandbox",
        "--disable-setuid-sandbox",
    ];

    it("should be a function", () => {
        expect(_setValue).toBeInstanceOf(Function);
    });

    it("Should set the value without an issue.", async () => {
        const browser = await puppeteer.launch({
            args: [...args],
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        );

        await page.setViewport({
            width: 1500,
            height: 900,
        });

        await page.goto("https://k6nzku.csb.app/");

        await _setValue({
            pageOrFrame: page,
            selector: `input[data-testid="first-name-field"]`,
            data: () => "John",
        });

        /** The following input element has a value already set. Normally it will cause an error because the value doesn't match */
        await _setValue({
            pageOrFrame: page,
            selector: `input[data-testid="last-name-field"]`,
            data: () => "Doe",
        });

        await _setValue({
            pageOrFrame: page,
            selector: `textarea[data-testid="bio-text-area"]`,
            data: "This is my bio",
        });

        await page.screenshot({ path: "test-artifacts/set-value.png" });

        await browser.close();
    }, 100000);
});
