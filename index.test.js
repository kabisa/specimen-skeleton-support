const path = require("path");
const { stripIndent } = require("common-tags");

const lib = require("./index");
const fontData = require("./fontData");

const fixtureFontPath = path.resolve(
  __dirname,
  "test",
  "__fixtures__",
  "Fraunces-VF.ttf"
);

describe("parseFontFile", () => {
  test("delegates to fontData.parseFontFile", async () => {
    const libResult = await lib.parseFontFile(fixtureFontPath);
    const expectedResult = await fontData.parseFontFile(fixtureFontPath);

    expect(libResult).toEqual(expectedResult);
  });
});

describe("buildStylesheet", () => {
  test("delegates to codeGeneration.buildStylesheet and stringifies", async () => {
    const fontData = await lib.parseFontFile(fixtureFontPath);

    const stylesheet = lib.buildStylesheet(fontData);

    expect(stylesheet).toEqual(stripIndent`
      @font-face {
          font-family: "Fraunces Light OpMin";
          src: url("undefined");
          font-weight: 1 1000;
      }

      .fraunces-light-opmin {
          --opsz: 9;
          --wght: 0;
          --WONK: 0.5;
      }

      .fraunces-light-opmin,
      .fraunces-light-opmin *,
      .fraunces-light-opmin *::before,
      .fraunces-light-opmin *::after {
          font-family: "Fraunces Light OpMin", var(--specimen-fallback-font, monospace), monospace;
          font-variation-settings: "opsz" var(--opsz),"wght" var(--wght),"WONK" var(--WONK);
      }
    `);
  });
});
