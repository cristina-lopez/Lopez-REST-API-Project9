'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      //allowNull: false,
      //validate: {
      //  notEmpty: {
      //    msg: "Title field cannot be empty."
       // }
      //}
    },
    lastName: {
      type: DataTypes.STRING,
      //allowNull: false,
      //validate: {
       // notEmpty: {
       //   msg: "Author field cannot be empty."
       // }
      //}
    },
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  User.associate = (models) => {
    // TODO Add associations.
    User.hasMany(models.Movie, {
      //as: 'director', //alias
      foreignKey: {
        fieldName: 'userPersonId',
        allowNull: false,
      }
    });
  };

  return User;
};