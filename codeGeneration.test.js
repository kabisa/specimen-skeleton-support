const { stripIndent } = require("common-tags");

const {
  buildFontFace,
  buildVarationVariables,
  buildVariationStyles,
  buildStylesheet,
  buildRegularStyles
} = require("./codeGeneration");

const variableFontDataFixture = {
  name: "My font",
  class: "my-font",
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

const regularFontDataFixture = {
  name: "My font",
  data: {
    axes: [],
    charset: [],
    instances: []
  }
};

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

    const rootDecl = buildVarationVariables(fontData).toString();

    expect(rootDecl).toEqual(stripIndent`
      .my-font {
          --wdth: 100;
          --wght: 0
      }
    `);
  });
});

describe("font variation settings", () => {
  test("sets variation settings per axis", () => {
    const css = buildVariationStyles(variableFontDataFixture).toString();

    expect(css).toEqual(stripIndent`
      .my-font,
      .my-font *,
      .my-font *::before,
      .my-font *::after {
          font-family: "My font", monospace;
          font-variation-settings: "wdth" var(--wdth),"wght" var(--wght)
      }
    `);
  });
});

describe("stylesheet", () => {
  test("includes body, css properties, font varation and @font-face", () => {
    const css = buildStylesheet(
      variableFontDataFixture,
      "./test/__fixtures__/Fraunces-VF.ttf"
    ).toString();

    expect(css).toEqual(stripIndent`
      @font-face {
          font-family: "My font";
          src: url("./test/__fixtures__/Fraunces-VF.ttf");
          font-weight: 1 1000;
          font-stretch: 50 200
      }
      .my-font {
          --wdth: 100;
          --wght: 0
      }
      .my-font,
      .my-font *,
      .my-font *::before,
      .my-font *::after {
          font-family: "My font", monospace;
          font-variation-settings: "wdth" var(--wdth),"wght" var(--wght)
      }
    `);
  });
});

describe("regular font", () => {
  test("regular font CSS for non-variable font", () => {
    const css = buildRegularStyles(regularFontDataFixture).toString();

    expect(css).toEqual(stripIndent`
      .my-font {
          font-family: "My font", monospace
      }
    `);
  });
});
