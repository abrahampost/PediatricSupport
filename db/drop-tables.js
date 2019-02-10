const User              = require("../models/user"),
      PatientInfo       = require("../models/patient-info"),
      PatientXParent    = require("../models/patient_x_parent");

async function dropTables() {
    try {
        await User.drop();
        console.log("Successfully dropped user table");
        await PatientInfo.drop();
        console.log("Successfully dropped patient-info table");
        await PatientXParent.drop();
        console.log("Successfully dropped patient-x-parent table");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

dropTables();