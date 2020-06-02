import Knex from 'knex'
//criar objectos no banco
export async function up(knex: Knex)//"atribui para a variavel knex o modulo"
{
    //criar tabela
    return knex.schema.createTable('points', table => {
        table.increments('id').primary() //incrementa 1 na coluna id e eh primary
        table.string('image').notNullable() //noNullble  = not null
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.string('whatsapp').notNullable()
        table.decimal('latitude').notNullable()
        table.decimal('longetude').notNullable()
        table.string('uf', 2).notNullable()
        table.string('city').notNullable()
    })
}

//rolback
export async function down(knex: Knex)
{
    return knex.schema.dropTable('points')
}