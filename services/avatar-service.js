const { createCanvas, loadImage } = require("canvas");

exports.renderImage = async (avatar) => {
    let canvas = createCanvas();
    let ctx = canvas.getContext('2d');
    Promise.all([
      retrieveImage('heads', avatar.heads),
      retrieveImage('hat', avatar.hats),
      retrieveImage('clothes', avatar.clothes),
      retrieveImage('accessories', avatar.accessories),
    ]).then((images) => {
      images.forEach((image) => {
        ctx.drawImage(image, 0, 0);
      });
      return canvas.toDataURL();
    });
}

const retrieveImage = async (feature, featureId) => {
  const loc = getPath(feature, featureId);
  return await loadImage(loc);
}

const getPath = (feature, featureId) => {
  const imageLoc = '../assets/avatar';
  const path = `${imageLoc}/${feature}/${featureId}.png`;
  return path;
}