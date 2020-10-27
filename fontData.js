const util = require("util");
const glyphData = require("./GlyphData.json");
const loadFont = util.promisify(require("fontkit").open);

const buildAxes = font => {
  return Object.entries(font.variationAxes).map(([axis, data]) => ({
    axis: axis,
    name: data.name,
    min: data.min,
    max: data.max,
    default: data.default
  }));
};

const suggestFontStyle = fontName => {
  const styles = [
    "italic",
    "thin",
    "hairline",
    "extra-light",
    "extra light",
    "extralight",
    "ultra-light",
    "ultra light",
    "ultralight",
    "light",
    "normal",
    "regular",
    "medium",
    "semi-bold",
    "semi bold",
    "semibold",
    "demi-bold",
    "demi bold",
    "demibold",
    "bold",
    "extra-bold",
    "extra bold",
    "extrabold",
    "ultra-bold",
    "ultra bold",
    "ultrabold",
    "black",
    "heavy",
    "extra-black",
    "extra black",
    "extrablack",
    "ultra-black",
    "ultra black",
    "ultrablack",
    "ultra-condensed",
    "ultra condensed",
    "ultracondensed",
    "extra-condensed",
    "extra condensed",
    "extracondensed",
    "condensed",
    "semi-condensed",
    "semi condensed",
    "semicondensed",
    "normal",
    "semi-expanded",
    "semi expanded",
    "semiexpanded",
    "expanded",
    "extra-expanded",
    "extra expanded",
    "extraexpanded",
    "ultra-expanded",
    "ultra expanded",
    "ultraexpanded"
  ];

  const matches = styles.filter(style =>
    fontName.toLowerCase().includes(style)
  );

  if (matches.length > 0) {
    return matches.join(" ");
  } else {
    return "unknown";
  }
};

const buildChars = font => {
  const fontCharset = font.characterSet.map(g =>
    Number(g)
      .toString(16)
      .padStart(4, "0")
      .toUpperCase()
  );

  // undefined = no subcategory
  const categories = {
    Letter: [
      undefined,
      "Uppercase",
      "Lowercase",
      "Superscript",
      "Modifier",
      "Ligature",
      "Halfform",
      "Matra",
      "Spacing",
      "Jamo",
      "Syllable",
      "Number"
    ],
    Number: [
      undefined,
      "Decimal Digit",
      "Small",
      "Fraction",
      "Spacing",
      "Letter"
    ],
    Punctuation: [
      undefined,
      "Quote",
      "Parenthesis",
      "Dash",
      "Spacing",
      "Modifier"
    ],
    Symbol: [
      undefined,
      "Currency",
      "Math",
      "Modifier",
      "Superscript",
      "Format",
      "Ligature",
      "Spacing",
      "Arrow",
      "Geometry"
    ],
    Separator: [undefined, "Space", "Format", "Nonspace"],
    Mark: [
      undefined,
      "Modifier",
      "Spacing",
      "Nonspacing",
      "Enclosing",
      "Spacing Combining",
      "Ligature"
    ],
    Other: [undefined, "Format"]
  };

  let charset = [];
  let allScriptChars = [];
  for (const category in categories) {
    for (const subCategory of categories[category]) {
      // Get all scripts in this subcategory
      let scripts = new Set();
      const subcatScripts = glyphData.filter(
        f => f.category === category && f.subCategory === subCategory
      );
      subcatScripts.map(sc => {
        scripts.add(sc.script);
      });

      // Loop over each script and see which chars are in the font
      for (const script of scripts) {
        const chars = glyphData.filter(
          f =>
            f.category === category &&
            f.subCategory === subCategory &&
            f.script === script
        );

        // Which chars are in the font?
        const presentChars = chars.filter(g => fontCharset.includes(g.unicode));

        // We only need the unicode values
        const scriptChars = presentChars.map(g => g.unicode);
        allScriptChars = [...allScriptChars, ...scriptChars];

        if (scriptChars.length !== 0) {
          const subCharset = {
            category: category,
            subCategory: subCategory || null,
            script: script || null,
            chars: scriptChars || null
          };

          if (
            charset.find(
              c =>
                c.category == subCharset.category &&
                c.subCategory == subCharset.subCategory &&
                c.script == subCharset.script
            ) === undefined
          ) {
            charset.push(subCharset);
          }
        }
      }
    }
  }

  // List all chars not grouped under scripts in a misc category
  // Also, ignore 0xFFFF which is erroneously reported as a char
  // by Fontkit
  const uncategorisedChars = fontCharset.filter(
    g => !allScriptChars.includes(g) && g != "FFFF"
  );
  if (uncategorisedChars.length !== 0) {
    charset.push({
      category: "Uncategorised",
      subCategory: null,
      script: null,
      chars: uncategorisedChars || null
    });
  }

  return charset;
};

const buildInstances = font => {
  return Object.entries(font.namedVariations).map(([name, axes]) => ({
    name,
    axes
  }));
};

module.exports.parseFontFile = async path => {
  const font = await loadFont(path);

  return {
    name: font.fullName,
    data: {
      axes: buildAxes(font),
      charset: buildChars(font),
      instances: buildInstances(font)
    }
  };
};

module.exports.suggestFontStyle = suggestFontStyle;
