/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    // id, username, password,salt, name, age,gender,email, passwordResetToken, passwordResetExpiration
  ]);
};

module.exports = {
  seed
}