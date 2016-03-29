'use strict';

/**
 * Todo Model
 * @desc Returns a Sequelize Todo model.
 * @type {Function}
 * @param {Object} sequelize - Sequelize instance
 * @param {Object} DateTypes - Sequelize data types
 * @return {Object} Todo Model
 */
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    task: DataTypes.STRING,
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  });

  return Todo;
};
