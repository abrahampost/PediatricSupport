const { createCanvas, loadImage } = require("canvas"),
      PatientInfo = require("../db/sequelize").patient_info,
      InternalErrorException = require("../exceptions/internal-error-exception");

exports.renderImage = async function(avatar) {
  try {
    let canvas = createCanvas(250, 320);
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

exports.getAvatar = async function(userId) {
  let info = await PatientInfo.findOne({
    attributes: [['rendered_avatar', 'avatar']],
    where: {
      user_id: userId
    }
  });
  if (info) {
    return info.dataValues.avatar;
  }
  // I return undefined here because a screen could still be rendered with a missing avatar
  // meaning, it is not a "don't return anything" error
  return undefined;
}

const retrieveImage = async function(feature, featureId) {
  const loc = getPath(feature, featureId);
  return await loadImage(loc);
}

const getPath = function (feature, featureId) {
  const imageLoc = '../assets/avatar';
  const path = `${__dirname}/${imageLoc}/${feature}/${featureId}.png`;
  return path;
}