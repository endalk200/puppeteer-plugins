import * as puppeteer from "puppeteer";
import { ElementNotFoundError, InputValidationError } from "./errors";

import { _type } from "./type";

describe("Test `_type` helper function", () => {
    const args: string[] = [
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-infobars",
        "--no-sandbox",
        "--disable-setuid-sandbox",
    ];

    it("should be a function", () => {
        expect(_type).toBeInstanceOf(Function);
    });

    it("Should type in correct input data and the input value should change", async () => {
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

        await _type({
            selector: `input[data-testid="first-name-field"]`,
            pageOrFrame: page,
            data: "John",
        });

        expect(
            await page.$eval(
                `input[data-testid="first-name-field"]`,
                (element: HTMLInputElement) => element.value
            )
        ).toBe("John");

        await page.screenshot({ path: "test-artifacts/correct-input.png" });

        await browser.close();
    }, 100000);

    it("Should type in correct input data and the input value shouldn't match the expected value.", async () => {
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

        try {
            await _type({
                selector: `input[data-testid="last-name-field"]`,
                pageOrFrame: page,
                data: "Doe",
            });
        } catch (error) {
            expect(error).toBeInstanceOf(InputValidationError);
        }

        await page.screenshot({ path: "test-artifacts/incorrect-input.png" });

        await browser.close();
    }, 100000);

    it("Should fail for element that doesn't exist.", async () => {
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

        try {
            await _type({
                selector: `input[data-testid="dont-exist-field"]`,
                pageOrFrame: page,
                data: "Doe",
            });
        } catch (error) {
            expect(error).toBeInstanceOf(ElementNotFoundError);
        }

        await page.screenshot({ path: "test-artifacts/incorrect-input.png" });

        await browser.close();
    }, 100000);
});
