const User              = require("../models/user"),
      PatientInfo       = require("../models/patient-info"),
      PatientXParent    = require("../models/patient-x-parent"),
      Attribute         = require("../models/attribute"),
      PatientXAttribute = require("../models/patient-x-attribute"),
      UserMatch         = require("../models/user_match");

async function dropTables() {
    try {
        await User.drop();
        console.log("Successfully dropped user table");
        await PatientInfo.drop();
        console.log("Successfully dropped patient-info table");
        await PatientXParent.drop();
        console.log("Successfully dropped patient-x-parent table");
        await Attribute.drop();
        console.log("Successfully dropped attribute table");
        await PatientXAttribute.drop();
        console.log("Successfully dropped patient-x-attribute table");
        await UserMatch.drop();
        console.log("Successfully dropped user-match table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

dropTables();