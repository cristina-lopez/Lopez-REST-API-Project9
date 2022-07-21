'use strict';
const {Model, DataTypes} = require('sequelize');
module.exports = (sequelize) => {
  class Course extends Model {
    
  }
  Course.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: 'user', //alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
    });
  };

  return Course;
};