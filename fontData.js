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
