const   bcrypt  = require("bcryptjs"),
        jwt     = require("jsonwebtoken"),
        User    = require("../db/sequelize").user;

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
exports.sign_up = async function(last_name, first_name, email, type) {
    try {
        let username = generateRandom();
        let unhashed_password = generateRandom();
        ValidatePassword(unhashed_password);
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
        //TODO: Email account owner.
        return 201;
    } catch (e) {
        if (e.name == "SequelizeUniqueConstraintError") {
            return sign_up(last_name, first_name, email, type);
        }
        return 400;
    }
}

let ValidatePassword = (password) => {
    //TODO: Add more password validations
    if (password.length < 7 || password.length > 40) {
        throw new Error("password length not valid");
    }
}

let generateRandom = exports.generate = () => {
    let firstWord = ["Busy", "Nimble", "Brave", "Mighty", "Clever", "Proud",
        "Fair", "Wise", "Loyal", "Happy", "Cheerful", "Joyful", "Friendly", "Moody",
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
    
}