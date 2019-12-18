const postcss = require("postcss");

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

    return postcss.decl({ prop: property, value: `${min} ${max}` });
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
const buildFontFace = (fontData, relativeFontPath) => {
  const fontFace = postcss.atRule({ name: "font-face" });

  const decls = [
    postcss.decl({ prop: "font-family", value: `"${fontData.name}"` }),
    postcss.decl({ prop: "src", value: `url("${relativeFontPath}")` }),
    axisRangeDeclaration(fontData, "font-weight", "wght"),
    axisRangeDeclaration(fontData, "font-stretch", "wdth")
  ].filter(d => d != null);

  fontFace.append(decls);

  return fontFace;
};

const buildProperties = fontData => {
  const rule = postcss.rule({ selector: ":root" });

  const properties = fontData.data.axes.map(axis => {
    return postcss.decl({
      prop: `--${axis.axis}`,
      value: axis.default
    });
  });

  rule.append(properties);
  return rule;
};

const buildFontVariationSettings = fontData => {
  const rule = postcss.rule({ selector: "*, *::before, *::after" });

  const varationSettings = fontData.data.axes.map(axis => {
    return `"${axis.axis}" var(--${axis.axis})`;
  });

  const fontVariationSettings = postcss.decl({
    prop: "font-variation-settings",
    value: varationSettings
  });

  rule.append(fontVariationSettings);

  return rule;
};

const buildBodyRule = fontData => {
  const rule = postcss.rule({ selector: "body" });

  rule.append(
    postcss.decl({
      prop: "font-family",
      value: [`"${fontData.name}"`, "monospace"]
    })
  );

  return rule;
};

/**
 * Generate a stylesheet for the passed font.
 *
 * Includes:
 * - @font-face
 * - CSS properties for each axis of the font
 * - A body rule that applies the given font
 * - Font varation settings that use the generated properties
 * @param {object} fontData
 * @param {string} relativeFontPath
 */
const buildStylesheet = (fontData, relativeFontPath) => {
  const root = postcss.root();

  root.append([
    buildFontFace(fontData, relativeFontPath),
    buildBodyRule(fontData),
    buildProperties(fontData),
    buildFontVariationSettings(fontData)
  ]);

  return root;
};

module.exports.buildFontFace = buildFontFace;
module.exports.buildProperties = buildProperties;
module.exports.buildFontVariationSettings = buildFontVariationSettings;
module.exports.buildBodyRule = buildBodyRule;
module.exports.buildStylesheet = buildStylesheet;
