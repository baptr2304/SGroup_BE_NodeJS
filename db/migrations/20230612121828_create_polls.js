/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('polls', function(table) {
        table.increments('id').primary();
        table.text('question');
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
    return knex.schema.dropTable('polls');
};
