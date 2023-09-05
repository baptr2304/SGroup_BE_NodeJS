/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('username');
    table.string('password');
    table.string('salt');
    table.string('name');
    table.integer('age');
    table.string('gender');
    table.string('email');
    table.string('passwordResetToken');
    table.string('passwordResetExpiration');
    table.timestamps(true, true);
    table.integer('created_by').unsigned().references('id').inTable('users')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex 
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
