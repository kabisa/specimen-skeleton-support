const { stripIndent } = require("common-tags");

const {
  buildFontFace,
  buildProperties,
  buildFontVariationSettings,
  buildBodyRule,
  buildStylesheet
} = require("./codeGeneration");

describe("@font-face", () => {
  test("basic @font-face declaration", () => {
    const fontData = {
      name: "My font",
      data: {
        axes: [],
        charset: [],
        instances: []
      }
    };

    const fontFace = buildFontFace(
      fontData,
      "./test/__fixtures__/Fraunces-VF.ttf"
    ).toString();

    expect(fontFace).toEqual(stripIndent`
      @font-face {
          font-family: "My font";
          src: url("./test/__fixtures__/Fraunces-VF.ttf")
      }
    `);
  });

  test("includes font-weight declaration if wght axis present", () => {
    const fontData = {
      name: "My font",
      data: {
        axes: [
          {
            axis: "wght",
            name: "Weight",
            min: 0,
            max: 1000,
            default: 0
          }
        ],
        charset: [],
        instances: []
      }
    };

    const fontFace = buildFontFace(
      fontData,
      "./test/__fixtures__/Fraunces-VF.ttf"
    ).toString();

    expect(fontFace).toEqual(stripIndent`
      @font-face {
          font-family: "My font";
          src: url("./test/__fixtures__/Fraunces-VF.ttf");
          font-weight: 1 1000
      }
    `);
  });

  test("includes font-stretch if wdth axis present", () => {
    const fontData = {
      name: "My font",
      data: {
        axes: [
          {
            axis: "wdth",
            name: "Width",
            min: 50,
            max: 200,
            default: 100
          }
        ],
        charset: [],
        instances: []
      }
    };

    const fontFace = buildFontFace(
      fontData,
      "./test/__fixtures__/Fraunces-VF.ttf"
    ).toString();

    expect(fontFace).toEqual(stripIndent`
      @font-face {
          font-family: "My font";
          src: url("./test/__fixtures__/Fraunces-VF.ttf");
          font-stretch: 50 200
      }
    `);
  });
});

describe("css properties", () => {
  test("generates a property per axis", () => {
    const fontData = {
      name: "My font",
      data: {
        axes: [
          {
            axis: "wdth",
            name: "Width",
            min: 50,
            max: 200,
            default: 100
          },
          {
            axis: "wght",
            name: "Weight",
            min: 0,
            max: 1000,
            default: 0
          }
        ],
        charset: [],
        instances: []
      }
    };

    const rootDecl = buildProperties(fontData).toString();

    expect(rootDecl).toEqual(stripIndent`
      :root {
          --wdth: 100;
          --wght: 0
      }
    `);
  });
});

describe("font variation settings", () => {
  test("sets variation settings per axis", () => {
    const fontData = {
      name: "My font",
      data: {
        axes: [
          {
            axis: "wdth",
            name: "Width",
            min: 50,
            max: 200,
            default: 100
          },
          {
            axis: "wght",
            name: "Weight",
            min: 0,
            max: 1000,
            default: 0
          }
        ],
        charset: [],
        instances: []
      }
    };

    const css = buildFontVariationSettings(fontData).toString();

    expect(css).toEqual(stripIndent`
      *, *::before, *::after {
          font-variation-settings: "wdth" var(--wdth),"wght" var(--wght)
      }
    `);
  });
});

describe("body rule", () => {
  test("builds body rule with font familiy", () => {
    const fontData = {
      name: "My Font",
      data: {
        axes: [],
        charset: [],
        instances: []
      }
    };

    const css = buildBodyRule(fontData).toString();

    expect(css).toEqual(stripIndent`
      body {
          font-family: "My Font",monospace
      }
    `);
  });
});

describe("stylesheet", () => {
  test("includes body, css properties, font varation and @font-face", () => {
    const fontData = {
      name: "My font",
      data: {
        axes: [
          {
            axis: "wdth",
            name: "Width",
            min: 50,
            max: 200,
            default: 100
          },
          {
            axis: "wght",
            name: "Weight",
            min: 0,
            max: 1000,
            default: 0
          }
        ],
        charset: [],
        instances: []
      }
    };

    const css = buildStylesheet(
      fontData,
      "./test/__fixtures__/Fraunces-VF.ttf"
    ).toString();

    expect(css).toEqual(stripIndent`
      @font-face {
          font-family: "My font";
          src: url("./test/__fixtures__/Fraunces-VF.ttf");
          font-weight: 1 1000;
          font-stretch: 50 200
      }
      body {
          font-family: "My font",monospace
      }
      :root {
          --wdth: 100;
          --wght: 0
      }
      *, *::before, *::after {
          font-variation-settings: "wdth" var(--wdth),"wght" var(--wght)
      }
    `);
  });
});
