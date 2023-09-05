/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('polls').del()
  await knex('polls').insert([
    // id, question, created_by
  ]);
};
