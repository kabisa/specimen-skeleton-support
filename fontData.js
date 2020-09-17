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

const buildChars = font => {
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
        const presentChars = chars.filter(g =>
          font.characterSet.includes(parseInt(g.unicode, 16))
        );

        // We only need the unicode values
        const scriptChars = presentChars.map(g => g.unicode);

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
    name: font.postscriptName,
    data: {
      axes: buildAxes(font),
      charset: buildChars(font),
      instances: buildInstances(font)
    }
  };
};
