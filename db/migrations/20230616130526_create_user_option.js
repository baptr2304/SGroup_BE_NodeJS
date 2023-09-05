/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('user_option', function(table) {
        table.integer('user_id').unsigned();
        table.integer('user_option').unsigned();
        table.foreign('user_id').references('id').inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
        table.foreign('user_option').references('id').inTable('options')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('user_option');
};
