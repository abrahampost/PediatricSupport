const User          = require("../models/user"),
      PatientInfo   = require("../models/patient-info");

async function dropTables() {
    try {
        await User.drop();
        console.log("Successfully dropped user table");
        await PatientInfo.drop();
        console.log("Successfully dropped patient-info table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

dropTables();