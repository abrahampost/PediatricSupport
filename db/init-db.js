const User          = require("../models/user"),
      PatientInfo   = require("../models/patient-info");

async function createTables() {
    try {
        await User.sync();
        console.log("Successfully created user table");
        await PatientInfo.sync();
        console.log("Successfully dropped patient-info table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createTables()