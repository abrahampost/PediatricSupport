const bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    User = require("../db/sequelize").user,
    BadRequestException = require("../exceptions/bad-request-exception"),
    InternalErrorException = require("../exceptions/internal-error-exception"),
    UnauthorizedRequestException = require("../exceptions/unauthorized-request-exception"),
    Sequelize = require("sequelize");

/**
 * Check Login
 * Takes in a login and password, and checks to see if they match a user in the database
 * If they do, send back a Promise<JWT>. If fails, sends Promise which resolves to false
 */
exports.check_login = async function (username, password) {
    let user = await User.findOne({ where: { username: username } });
    if(!user) {
        throw new UnauthorizedRequestException("Incorrect username and password combination.");
    }
    let result = await bcrypt.compare(password, user.password);
    
    if (result) {
        return jwt.sign({
            id: user.id
        }, process.env.SIGN_KEY, {
                expiresIn: "2 weeks"
            });
    } else {
        throw new UnauthorizedRequestException("Incorrect username and password combination.");
    }
}

/**
 * Sign up
 * Pass a username, unhashed_password, last_name, first_name, and it will save
 * the user to the database. It will return the status code of the 
 */
exports.sign_up = async function (username, unhashed_password, last_name, first_name, email, type) {
    ValidatePassword(unhashed_password);

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
        await user.save();
        return 201;
    } catch (e) {
        if (e instanceof Sequelize.ValidationError) {
            let errorMessage = "The following values are invalid:";
            e.errors.forEach((error) => {
                errorMessage += `\n${error.path}: ${error.message}`;
            });
            throw new BadRequestException(errorMessage);
        }
        console.error(`A problem occurred when saving a user: ${e.stack}`);
        throw new InternalErrorException("A problem occurred when saving the user");
    }
}

let ValidatePassword = (password) => {
    //TODO: Add more password validations
    if (!password || password.length < 7 || password.length > 40) {
        throw new BadRequestException("password length not valid");
    }
}