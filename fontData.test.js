const path = require("path");
const { parseFontFile } = require("./fontData");

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
    {
      category: "Letter",
      chars: [
        "0041",
        "0042",
        "0043",
        "0044",
        "0045",
        "0046",
        "0047",
        "0048",
        "0049",
        "004A",
        "004B",
        "004C",
        "004D",
        "004E",
        "004F",
        "0050",
        "0051",
        "0052",
        "0053",
        "0054",
        "0055",
        "0056",
        "0057",
        "0058",
        "0059",
        "005A"
      ],
      script: "latin",
      subCategory: "Uppercase"
    },
    {
      category: "Letter",
      chars: [
        "0061",
        "0062",
        "0063",
        "0064",
        "0065",
        "0066",
        "0067",
        "0068",
        "0069",
        "006A",
        "006B",
        "006C",
        "006D",
        "006E",
        "006F",
        "0070",
        "0071",
        "0072",
        "0073",
        "0074",
        "0075",
        "0076",
        "0077",
        "0078",
        "0079",
        "007A"
      ],
      script: "latin",
      subCategory: "Lowercase"
    },
    {
      category: "Number",
      chars: [
        "0030",
        "0031",
        "0032",
        "0033",
        "0034",
        "0035",
        "0036",
        "0037",
        "0038",
        "0039"
      ],
      script: null,
      subCategory: "Decimal Digit"
    },
    {
      category: "Punctuation",
      chars: [
        "0021",
        "002C",
        "002E",
        "002F",
        "003A",
        "003B",
        "003F",
        "005C",
        "00A1",
        "00BF",
        "2026"
      ],
      script: null,
      subCategory: null
    },
    {
      category: "Punctuation",
      chars: [
        "0022",
        "0027",
        "00AB",
        "00BB",
        "2018",
        "2019",
        "201C",
        "201D",
        "2039",
        "203A"
      ],
      script: null,
      subCategory: "Quote"
    },
    {
      category: "Punctuation",
      chars: ["0028", "0029", "005B", "005D", "007B", "007D"],
      script: null,
      subCategory: "Parenthesis"
    },
    {
      category: "Punctuation",
      chars: ["002D", "005F", "2013", "2014"],
      script: null,
      subCategory: "Dash"
    },
    {
      category: "Symbol",
      chars: ["0026", "007C"],
      script: null,
      subCategory: null
    },
    {
      category: "Separator",
      chars: ["0020", "00A0"],
      script: null,
      subCategory: "Space"
    }
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
