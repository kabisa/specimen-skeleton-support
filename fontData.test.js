const path = require("path");
const { parseFontFile, buildCssFontFace } = require("./fontData");

const fixtureFontPath = path.resolve(
  __dirname,
  "test",
  "__fixtures__",
  "Fraunces-VF.ttf"
);

test("Extracts axes", async () => {
  const fontData = await parseFontFile(fixtureFontPath);

  expect(fontData.data.axes).toEqual([
    {
      axis: "opsz",
      name: "Optical Size",
      min: 9,
      max: 144,
      default: 9
    },
    {
      axis: "wght",
      name: "Weight",
      min: 0,
      max: 1000,
      default: 0
    },
    {
      axis: "WONK",
      name: "wonk",
      min: 0,
      max: 1,
      default: 0.5
    }
  ]);
});

test("Extracts charset", async () => {
  const fontData = await parseFontFile(fixtureFontPath);

  expect(fontData.data.charset).toEqual([
    "&#32;",
    "&#33;",
    "&#34;",
    "&#38;",
    "&#39;",
    "&#40;",
    "&#41;",
    "&#44;",
    "&#45;",
    "&#46;",
    "&#47;",
    "&#48;",
    "&#49;",
    "&#50;",
    "&#51;",
    "&#52;",
    "&#53;",
    "&#54;",
    "&#55;",
    "&#56;",
    "&#57;",
    "&#58;",
    "&#59;",
    "&#63;",
    "&#65;",
    "&#66;",
    "&#67;",
    "&#68;",
    "&#69;",
    "&#70;",
    "&#71;",
    "&#72;",
    "&#73;",
    "&#74;",
    "&#75;",
    "&#76;",
    "&#77;",
    "&#78;",
    "&#79;",
    "&#80;",
    "&#81;",
    "&#82;",
    "&#83;",
    "&#84;",
    "&#85;",
    "&#86;",
    "&#87;",
    "&#88;",
    "&#89;",
    "&#90;",
    "&#91;",
    "&#92;",
    "&#93;",
    "&#95;",
    "&#97;",
    "&#98;",
    "&#99;",
    "&#100;",
    "&#101;",
    "&#102;",
    "&#103;",
    "&#104;",
    "&#105;",
    "&#106;",
    "&#107;",
    "&#108;",
    "&#109;",
    "&#110;",
    "&#111;",
    "&#112;",
    "&#113;",
    "&#114;",
    "&#115;",
    "&#116;",
    "&#117;",
    "&#118;",
    "&#119;",
    "&#120;",
    "&#121;",
    "&#122;",
    "&#123;",
    "&#124;",
    "&#125;",
    "&#160;",
    "&#161;",
    "&#171;",
    "&#187;",
    "&#191;",
    "&#8211;",
    "&#8212;",
    "&#8216;",
    "&#8217;",
    "&#8220;",
    "&#8221;",
    "&#8230;",
    "&#8249;",
    "&#8250;",
    "&#65535;"
  ]);
});

test("Extracts instances", async () => {
  const fontData = await parseFontFile(fixtureFontPath);

  expect(fontData.data.instances).toEqual([
    {
      name: "Black OpMax",
      axes: {
        opsz: 144,
        wght: 1000,
        WONK: 0.5
      }
    },
    {
      name: "Black OpMid",
      axes: {
        opsz: 24,
        wght: 1000,
        WONK: 0.5
      }
    },
    {
      name: "Black OpMin",
      axes: {
        opsz: 9,
        wght: 1000,
        WONK: 0.5
      }
    },
    {
      name: "Bold OpMax",
      axes: {
        opsz: 144,
        wght: 815.3846130371094,
        WONK: 0.5
      }
    },
    {
      name: "Bold OpMid",
      axes: {
        opsz: 24,
        wght: 815.3846130371094,
        WONK: 0.5
      }
    },
    {
      name: "Bold OpMin",
      axes: {
        opsz: 9,
        wght: 815.3846130371094,
        WONK: 0.5
      }
    },
    {
      name: "Semibold OpMax",
      axes: {
        opsz: 144,
        wght: 630.7692260742188,
        WONK: 0.5
      }
    },
    {
      name: "Semibold OpMid",
      axes: {
        opsz: 24,
        wght: 630.7692260742188,
        WONK: 0.5
      }
    },
    {
      name: "Semibold OpMin",
      axes: {
        opsz: 9,
        wght: 630.7692260742188,
        WONK: 0.5
      }
    },
    {
      name: "Regular OpMax",
      axes: {
        opsz: 144,
        wght: 400,
        WONK: 0.5
      }
    },
    {
      name: "Regular OpMid",
      axes: {
        opsz: 24,
        wght: 400,
        WONK: 0.5
      }
    },
    {
      name: "Regular OpMin",
      axes: {
        opsz: 9,
        wght: 400,
        WONK: 0.5
      }
    },
    {
      name: "Light OpMax",
      axes: {
        opsz: 144,
        wght: 200,
        WONK: 0.5
      }
    },
    {
      name: "Light OpMid",
      axes: {
        opsz: 24,
        wght: 200,
        WONK: 0.5
      }
    },
    {
      name: "Light OpMin",
      axes: {
        opsz: 9,
        wght: 200,
        WONK: 0.5
      }
    },
    {
      name: "Thin OpMax",
      axes: {
        opsz: 144,
        wght: 0,
        WONK: 0.5
      }
    },
    {
      name: "Thin OpMid",
      axes: {
        opsz: 24,
        wght: 0,
        WONK: 0.5
      }
    },
    {
      name: "Thin OpMin",
      axes: {
        opsz: 9,
        wght: 0,
        WONK: 0.5
      }
    }
  ]);
});

test("builds basic css @font-face declaration", () => {
  const fontData = {
    name: "My font",
    data: {
      axes: [],
      charset: [],
      instances: []
    }
  };

  const fontFace = buildCssFontFace(
    fontData,
    "./test/__fixtures__/Fraunces-VF.ttf"
  );

  expect(fontFace).toEqual(
    "@font-face {\n" +
      "    font-family: My font;\n" +
      '    src: url("./test/__fixtures__/Fraunces-VF.ttf")\n' +
      "}"
  );
});

test("includes font-weight in @font-face declaration if wght axis present", () => {
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

  const fontFace = buildCssFontFace(
    fontData,
    "./test/__fixtures__/Fraunces-VF.ttf"
  );

  expect(fontFace).toEqual(
    "@font-face {\n" +
      "    font-family: My font;\n" +
      '    src: url("./test/__fixtures__/Fraunces-VF.ttf");\n' +
      "    font-weight: 1 1000\n" +
      "}"
  );
});

test("includes font-stretch in @font-face declaration if wdth axis present", () => {
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

  const fontFace = buildCssFontFace(
    fontData,
    "./test/__fixtures__/Fraunces-VF.ttf"
  );

  expect(fontFace).toEqual(
    "@font-face {\n" +
      "    font-family: My font;\n" +
      '    src: url("./test/__fixtures__/Fraunces-VF.ttf");\n' +
      "    font-stretch: 50 200\n" +
      "}"
  );
});
