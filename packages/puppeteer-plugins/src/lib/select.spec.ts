import * as puppeteer from "puppeteer";

import { _select } from "./select";

describe("Test `_select` helper function", () => {
    const args: string[] = [
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--disable-infobars",
        "--no-sandbox",
        "--disable-setuid-sandbox",
    ];

    it("should be a function", () => {
        expect(_select).toBeInstanceOf(Function);
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

        await _select({
            pageOrFrame: page,
            selector: `select[data-testid="favorite-framework-select"]`,
            value: "REACT",
        });

        expect(
            await page.$eval(
                `select[data-testid="favorite-framework-select"]`,
                (element: HTMLSelectElement) => element.value
            )
        ).toBe("REACT");

        await _select({
            pageOrFrame: page,
            selector: `select[data-testid="favorite-framework-select"]`,
            value: "NEXTJS",
            text: "NextJs",
        });

        expect(
            await page.$eval(
                `select[data-testid="favorite-framework-select"]`,
                (element: HTMLSelectElement) => element.value
            )
        ).toBe("NEXTJS");

        await _select({
            pageOrFrame: page,
            selector: `select[data-testid="favorite-framework-select"]`,
            value: "VUE",
            text: "VueJs",
        });

        await page.screenshot({ path: "test-artifacts/select.png" });

        await browser.close();
    }, 100000);
});
