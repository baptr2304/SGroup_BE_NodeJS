const knex = require('../db/knex');



// Function to execute a query using Knex
const executeQuery = async ({ query, params }) => {
  try {
    const result = await knex.raw(query, params);
    return result;
  } catch (error) {
    throw error;
  }
};

// Function to get one record
const getOne = async ({ query, params }) => {
  try {
    const [record] = await executeQuery({ query, params });
    return record || null;
  } catch (error) {
    throw error;
  }
};

// Function to get many records
const getMany = async ({ query, params }) => {
  try {
    const records = await executeQuery({ query, params });
    return records;
  } catch (error) {
    throw error;
  }
};

// Function to create a record
const create = async ({ query, params }) => {
  try {
    const result = await executeQuery({ query, params });
    return result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};

// Function to update one record
const updateOne = async ({ query, params }) => {
  try {
    const result = await executeQuery({ query, params });
    return result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOne,
  create,
  getMany,
  executeQuery,
  updateOne,
};
