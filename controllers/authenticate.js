let express = require("express"),
    router = express.Router(),
    userService = require("../services/user-service");

router.post('/login', async function (req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        verify = await userService.checkLogin(username, password);
        res.json({ token: verify });
    } catch (e) {
        next(e);
    }
});

router.post('/signup', async function(req, res) {
    try {
        let username = generateRandom();
        let password = generateRandom();
        let email = req.body.email;
        let type = req.body.type;
        let lastName = req.body.lastName;
        let firstName = req.body.firstName;
        let status = await userService.sign_up(username, password, lastName, firstName, email, type)
        res.sendStatus(status);
    } catch(e)  {
        next(e);
    }
});

let generateRandom = exports.generate = () => {
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

module.exports = router;