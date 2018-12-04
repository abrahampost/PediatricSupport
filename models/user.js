const   Sequelize   = require("sequelize"),
        sequelize   = require("../db/sequelize"),
        bcrypt    = require("bcryptjs"),
        jwt         = require("jsonwebtoken");


const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        require: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false,
        require: true,
        unique: true,
        validate: {
            isAlphanumeric: true
        }
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
        require: true,
        validate: {
            min: 7,
            max: 40
        }
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        require: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        require: true
    }
});

/**
 * Check Login
 * Takes in a login and password, and checks to see if they match a user in the database
 * If they do, send back a Promise<JWT>. If fails, sends Promise which resolves to false
 */
exports.check_login = async function (username, password) {
    try {
        let user = await User.findOne({where: {username: username}})
        let result = await bcrypt.compare(password, user.password)
        if (result) {
            return jwt.sign({
                id: user.id
            }, process.env.SIGN_KEY, {
                expiresIn: "2 weeks"
            });
        } else {
            //if it doesn't verify, return false
            return false;
        }
    } catch (e) {
        return false;
    }
}

/**
 * Sign up
 * Pass a username, unhashed_password, last_name, first_name, and it will save
 * the user to the database. It will return the status code of the 
 */
exports.sign_up = async function(username, unhashed_password, last_name, first_name) {
    try {
        let salt = await bcrypt.genSalt(10);
        let password = await bcrypt.hash(unhashed_password, salt);
        let user = await User.build({
            username,
            password,
            last_name,
            first_name
        });
        await user.save();
        return 201;
    } catch (e) {
        if (e.name == "SequelizeUniqueConstraintError") {
            return 409;
        }
        return 401;
    }
}