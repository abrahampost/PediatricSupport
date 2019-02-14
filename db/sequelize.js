let Sequelize = require("sequelize"),
    Attribute = require("../models/attribute"),
    User = require("../models/user"),
    PatientInfo = require("../models/patient-info"),
    PatientXAttribute = require("../models/patient-x-attribute"),
    UserMatch = require("../models/user-match"),
    PatientXParent = require("../models/patient-x-parent");

if (!process.env.DATABASE_URL) {
    require("dotenv").config()
}

let options = {
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false,
    logging: false
}

let sequelize;
if (process.env.NODE_ENV == 'test') {
    sequelize = new Sequelize(process.env.TEST_DATABASE_URL, options);
} else if (process.env.NODE_ENV == "testlocal") {
    //this only tests locally
    options['dialect'] = 'sqlite';
    options['storage'] = 'db/data.db';
    sequelize = new Sequelize("local", "root", "pass", options);
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, options);

}

//define models
sequelize.attribute = Attribute.init_table(sequelize);
sequelize.user = User.init_table(sequelize);
sequelize.user_match = UserMatch.init_table(sequelize);
sequelize.patient_x_attribute = PatientXAttribute.init_table(sequelize);
sequelize.patient_x_parent = PatientXParent.init_table(sequelize);
sequelize.patient_info = PatientInfo.init_table(sequelize);

//define relationships
sequelize.user.belongsToMany(sequelize.attribute, {through: sequelize.patient_x_attribute, foreignKey: 'patient_id', otherKey:'attribute_id'});
sequelize.patient_info.belongsTo(sequelize.user, {foreignKey: 'user_id'});
sequelize.user.belongsToMany(sequelize.user, {through: sequelize.patient_x_parent, as:'PatientXParent', foreignKey:'patient_id', otherKey:'parent_id'});
sequelize.user.belongsToMany(sequelize.user, {through: sequelize.user_match, as: 'UserMatch', foreignKey:'user_one_id', otherKey:'user_two_id'});

module.exports = sequelize;