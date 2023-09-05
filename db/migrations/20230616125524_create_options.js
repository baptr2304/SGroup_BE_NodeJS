/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('options', function(table) {
        table.increments('id').primary();
        table.integer('poll_id').unsigned();
        table.text('option_text');
        table.foreign('poll_id').references('id').inTable('polls')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('options');
};
