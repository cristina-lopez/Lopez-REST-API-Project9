'use strict';
const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {

  }
  User.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true,
    // },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "First Name field cannot be empty."
       }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Last Name field cannot be empty."
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email you entered already exists.'
      },
      validate: {
        notEmpty: {
          msg: "Email field cannot be empty."
        },
        isEmail: {
          msg: 'Please provide a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password field cannot be empty."
        }
      }
    },
  }, {
    sequelize,
  });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: 'user', //alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };

  return User;
};