const util = require("util");
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
  return font.characterSet.map(code => `&#${code};`);
};

const buildInstances = font => {
  return Object.entries(font.namedVariations).map(([name, axes]) => ({
    name,
    axes
  }));
};

const parseFontFile = async path => {
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

/**
 * Generates a css declaration based on a font axis.
 * @param {object} fontData
 * @param {string} property - css property to generate
 * @param {string} axisName - name of the font axis
 *
 * @example axisRangeDeclaration(fontData, "font-weight", "wght");
 * // returns "font-weight: 1 500;" (depending on actual range of font)
 */
const axisRangeDeclaration = (fontData, property, axisName) => {
  const axis = fontData.data.axes.find(({ axis }) => axis == axisName);

  const declaration = axis => {
    const min = Math.max(axis.min, 1); // 0 is not valid in css in this context
    const max = axis.max;

    return `${property}: ${min} ${max};`;
  };

  return axis ? declaration(axis) : null;
};

/**
 * Generates a CSS @font-face declaration for the provided font file.
 *
 * Includes:
 * - font-familiy
 * - font-weight (if font has a wght axis)
 * - font-stretch (if font has wdth axis)
 * - src
 * @param {object} fontData
 * @param {string} relativeFontPath
 */
const buildCssFontFace = (fontData, relativeFontPath) => {
  const declarations =
    [
      `font-family: ${fontData.name};`,
      axisRangeDeclaration(fontData, "font-weight", "wght"),
      axisRangeDeclaration(fontData, "font-stretch", "wdth"),
      `src: url("${relativeFontPath}");`
    ]
      .filter(d => d != null)
      .map(d => `  ${d}`)
      .join("\n") + "\n";

  return `@font-face {\n${declarations}}`;
};

module.exports.parseFontFile = parseFontFile;
module.exports.buildCssFontFace = buildCssFontFace;
