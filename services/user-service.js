const bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  User = require("../db/sequelize").user,
  PatientXAttribute = require("../db/sequelize").patient_x_attribute,
  PatientInfo = require("../db/sequelize").patient_info,
  Attribute = require("../db/sequelize").attribute,
  BadRequestException = require("../exceptions/bad-request-exception"),
  InternalErrorException = require("../exceptions/internal-error-exception"),
  UnauthorizedRequestException = require("../exceptions/unauthorized-request-exception"),
  PediatricSupportException = require("../exceptions/pediatric-support-exception"),
  Sequelize = require("sequelize");

/**
 * Check Login
 * Takes in a login and password, and checks to see if they match a user in the database
 * If they do, send back a Promise<JWT>. If fails, sends Promise which resolves to false
 */
exports.checkLogin = async function (username, password) {
    let user = await User.findOne({ where: { username: username } });
    if (!user) {
        throw new UnauthorizedRequestException("Incorrect username and password combination.");
    }
    let result = await bcrypt.compare(password, user.password);

    if (result) {
        let token = jwt.sign({
            iss: "pediatricsupport",
            sub: user.id,
            lvl: user.type
        }, process.env.SIGN_KEY, {
                expiresIn: "2 weeks"
            })
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                type: user.type
            }
        };
    } else {
        throw new UnauthorizedRequestException("Incorrect username and password combination.");
    }
}

exports.resetPassword = async function (username, oldPassword, newPassword) {
    try {
        let user = await User.findOne({ where: { username: username } });
        if (!user) {
            throw new UnauthorizedRequestException("Incorrect username and password combination.");
        }
        let result = await bcrypt.compare(oldPassword, user.password);

        if (result) {
            validatePassword(newPassword);

            let salt = await bcrypt.genSalt(10);
            let password = await bcrypt.hash(newPassword, salt);

            await user.update({
                password: password
            });
        } else {
            throw new UnauthorizedRequestException("Incorrect username and password combination.");
        }
    } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        } else if (e instanceof PediatricSupportException) {
            throw e;
        }

        throw new InternalErrorException("A problem occurred when resetting the user password", e);
    }
}

exports.linkPatientParent = async function (patient, parent) {
    try {
      await patient.addPatientXParent(parent);
    } catch (e) {
      throw new InternalErrorException("A problem occurred when saving the user", e);
    }
}

/**
 * Sign up
 * Pass a username, unhashed_password, last_name, first_name, and it will save
 * the user to the database. It will return the status code of the 
 */
exports.signUp = async function (username, unhashed_password, last_name, first_name, email, type) {
    try {
        let salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(unhashed_password, salt);
        let user = await User.build({
            username,
            password,
            email,
            type,
            last_name,
            first_name
        });
        let created_user = await user.save();
        return created_user;
    } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        }

        throw new InternalErrorException("A problem occurred when saving the user", e);
    }
}

exports.updatePatientInfo = async function (userid, interests, biography, avatar) {
  
  try {
    //delete interests:
    let patient = await User.findOne({where: {
        id: userid
    }});
    await PatientXAttribute.destroy({
        where: {
            patient_id: userid
        }
    });
    let userInterests = [];
    for (i = 0; i < interests.length; i++) {
        userInterests.push({
            patient_id: userid,
            attribute_id: interests[i]
        });
    }
    await PatientXAttribute.bulkCreate(userInterests);

    //create new patient info
    let patientInfo = await PatientInfo.build({
        biography,
        avatarHeads: avatar.heads,
        avatarClothes: avatar.clothes,
        avatarHats: avatar.hats,
        avatarAccessories: avatar.accessories
    });
    await patient.setPatientInfo(patientInfo);
    await patient.save();
  } catch (e) {
      if (e instanceof Sequelize.ValidationError) {
          let errorMessage = "The following values are invalid:";
          e.errors.forEach((error) => {
              errorMessage += `\n${error.path}: ${error.message}`;
          });
          throw new BadRequestException(errorMessage);
      }
      throw new InternalErrorException("A problem occurred when updating user info", e);
  }
}

exports.getPatientInfo = async function (id) {
  try {
    let info = await PatientInfo.findOne({
      attributes: ['biography', 'avatarAccessories', 'avatarHeads', 'avatarClothes', 'avatarHats'],
      where: {
        user_id: id
      },
    });
    let user = await User.findOne({
      attributes: [],
      where: {
        id: id,
      },
      include: [{
        model: Attribute,
        as: 'attributes',
        attributes: ['id', 'name'],
        where: {
          type: 'interest'
        },
        order: [
          ['id', 'ASC']
        ],
        require: false,
      }],
      require: false
    });
    let attributes = [];
    if (user) {
      attributes = user.attributes.map((attr) => {
        return {
          id: attr.id,
          name: attr.name
        };
      })
    }
    return {
        biography: info.biography,
        attributes: attributes,
        avatar: {
            accessories: info.avatarAccessories,
            clothes: info.avatarClothes,
            hats: info.avatarHats,
            heads: info.avatarHeads,
        }
    };
  } catch(e) {
    if (e instanceof Sequelize.ValidationError) {
      let errorMessage = "The following values are invalid:";
      e.errors.forEach((error) => {
        errorMessage += `\n${error.path}: ${error.message}`;
      });
      throw new BadRequestException(errorMessage);
    }
    throw new InternalErrorException("A problem occurred retrieving user info", e);
  }
}

exports.createPatientInfo = async function (patient) {
    try {
        let patientInfo = await PatientInfo.create();
        patient.setPatientInfo(patientInfo);
        await patient.save();
    } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        }
        throw new InternalErrorException("A problem occurred updating user info",e);
    }
}

exports.generateRandom = function () {
    let firstWord = ["Busy", "Nimble", "Brave", "Mighty", "Clever", "Proud",
        "Fair", "Wise", "Loyal", "Happy", "Cheerful", "Joyful", "Friendly", "Powerful",
        "Excited", "Calm", "Alert", "Tough", "Polite", "Amusing", "Kind", "Gentle", "Caring",
        "Good", "Cozy", "Great", "Beautiful", "Glowing", "Snug"];

    let lastWord = ["Shepherd", "Cake", "Moon", "Apple", "Banana", "Bike",
        "Clover", "Crowd", "Lake", "Pear", "River", "Road", "Rose", "Water",
        "Chicken", "Deer", "Drum", "Goose", "Grape", "Horse", "Kitten", "Owl", "Spoon",
        "Ladybug", "Pancake", "Pear", "Quilt", "Scarf", "Stream", "Throne", "Badge", "Magic",
        "Bubble", "Island", "Lamp", "Marble"];

    let randNum = Math.floor(Math.random() * 100);
    if (randNum == 13 | randNum == 69) {
        randNum++;
    }

    let randString = firstWord[Math.floor(Math.random() * firstWord.length)] +
        lastWord[Math.floor(Math.random() * lastWord.length)] + randNum;

    return randString;

};

let validatePassword = (password) => {
    //TODO: Add more password validations
    if (!password || password.length < 7 || password.length > 40) {
        throw new BadRequestException("password length not valid");
    }
}