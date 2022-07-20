'use strict';
const {Model, DataTypes} = require('sequelize');
//comment example
module.exports = (sequelize) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init({
    title: {
      type: DataTypes.STRING,
      //allowNull: false,
      //validate: {
      //  notEmpty: {
      //    msg: "Title field cannot be empty."
       // }
      //}
    },
    description: {
      type: DataTypes.TEXT,
      //allowNull: false,
      //validate: {
       // notEmpty: {
       //   msg: "Author field cannot be empty."
       // }
      //}
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  Course.associate = (models) => {
    // TODO Add associations.
    Course.belongsTo(models.User, {
      //as: 'director', //alias
      foreignKey: {
        fieldName: 'userPersonId',
        allowNull: false,
      }
    });
  };

  return User;
};