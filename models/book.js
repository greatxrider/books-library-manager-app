'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Book.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          notNull: {
            msg: 'Please provide a value for "title"',
          },
          msg: 'Please provide a value for "title"',
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          notNull: {
            msg: 'Please provide a value for "author"',
          },
          msg: 'Please provide a value for "author"',
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          notNull: {
            msg: 'Please provide a value for "genre"',
          },
          msg: 'Please provide a value for "genre"',
        }
      }
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for "year"',
        },
        min: {
          args: 1,
          msg: 'Please provide a value greater than "0" for "year"',
        },
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
  });

  return Book;
};
