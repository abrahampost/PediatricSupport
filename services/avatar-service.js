const { createCanvas, loadImage } = require("canvas"),
      InternalErrorException = require("../exceptions/internal-error-exception");

exports.renderImage = async (avatar) => {
  try {
    let canvas = createCanvas();
    let ctx = canvas.getContext('2d');
    let images = await Promise.all([
      retrieveImage('heads', avatar.heads),
      retrieveImage('hats', avatar.hats),
      retrieveImage('clothes', avatar.clothes),
      retrieveImage('accessories', avatar.accessories),
    ]);
    images.forEach((image) => {
      ctx.drawImage(image, 0, 0);
    });
    return canvas.toDataURL();
  } catch(e) {
    console.error(e);
    throw new InternalErrorException("Unable to create avatar", e);
  }
}

const retrieveImage = async (feature, featureId) => {
  const loc = getPath(feature, featureId);
  return await loadImage(loc);
}

const getPath = (feature, featureId) => {
  const imageLoc = '../assets/avatar';
  const path = `${__dirname}/${imageLoc}/${feature}/${featureId}.png`;
  return path;
}