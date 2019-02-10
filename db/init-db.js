const User              = require("../models/user"),
      PatientInfo       = require("../models/patient-info"),
      PatientXParent    = require("../models/patient_x_parent");

async function createTables() {
    try {
        await User.sync();
        console.log("Successfully created user table");
        await PatientInfo.sync();
        console.log("Successfully created patient-info table");
        await PatientXParent.sync();
        console.log("Successfully created patient-x-parent table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

createTables()