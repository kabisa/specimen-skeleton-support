const postcss = require("postcss");
const Stringifier = require("postcss/lib/stringifier");

/**
 * Custom PostCSS Stringifier that 'pretty prints' CSS.
 * Currently it only applies spacing between rules.
 */
class PrettyStringifier extends Stringifier {
  static new() {
    return (node, builder) => {
      let str = new this(builder);
      str.stringify(node);
    };
  }

  constructor(builder) {
    super(builder);
  }

  rule(node) {
    if (node.prev()) {
      this.builder("\n", node);
    }

    return super.rule(node);
  }

  decl(node) {
    return super.decl(node, true); // force semicolon
  }
}

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

const buildVarationVariables = fontData => {
  const rule = postcss.rule({ selector: getSelector(fontData) });

  const properties = fontData.data.axes.map(axis => {
    return postcss.decl({
      prop: `--${axis.axis}`,
      value: axis.default
    });
  });

  rule.append(properties);
  return rule;
};

const buildVariationStyles = fontData => {
  const selector = getSelector(fontData);

  const rule = postcss.rule({
    selector: `${selector},\n${selector} *,\n${selector} *::before,\n${selector} *::after`
  });

  const varationSettings = fontData.data.axes.map(axis => {
    return `"${axis.axis}" var(--${axis.axis})`;
  });

  rule.append(
    postcss.decl({
      prop: "font-family",
      value: `"${fontData.name}", monospace`
    })
  );

  rule.append(
    postcss.decl({
      prop: "font-variation-settings",
      value: varationSettings
    })
  );

  return rule;
};

const buildRegularStyles = fontData => {
  const rule = postcss.rule({ selector: getSelector(fontData) });

  rule.append(
    postcss.decl({
      prop: "font-family",
      value: `"${fontData.name}", monospace`
    })
  );

  return rule;
};

const buildStylesheet = (fontData, relativeFontPath) => {
  const root = postcss.root();

  root.append(buildFontFace(fontData, relativeFontPath));

  if (fontData.data.axes.length) {
    root.append(buildVarationVariables(fontData));
    root.append(buildVariationStyles(fontData));
  } else {
    root.append(buildRegularStyles(fontData));
  }

  return root;
};

const buildFontJs = fontData => {
  return `fontNames.push("${fontData.name}");\n`;
};

const getSelector = (fontData, htmlClass) => {
  let selector = htmlClass ? "" : ".";
  selector += fontData.name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[-]+/g, "-")
    .replace(/[^\w-]+/g, "");
  return selector;
};

module.exports.buildFontFace = buildFontFace;
module.exports.buildVarationVariables = buildVarationVariables;
module.exports.buildVariationStyles = buildVariationStyles;
module.exports.buildRegularStyles = buildRegularStyles;
module.exports.buildStylesheet = buildStylesheet;
module.exports.PrettyStringifier = PrettyStringifier;
module.exports.buildFontJs = buildFontJs;
module.exports.getSelector = getSelector;
