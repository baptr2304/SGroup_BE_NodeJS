/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('user_option').del()
  await knex('user_option').insert([
    // user_id, user_option
  ]);
};
