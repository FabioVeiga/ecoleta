import Knex from 'knex'

export async function seed(knex: Knex) {
    await knex('items').insert([
        {title: 'Lâmpadas', image: 'lampadas.svg'},
        {title: 'Pilhas e baterias', image: 'baterias.svg'},
        {title: 'Papéis e Papalão', image: 'papeis-papelao.svg'},
        {title: 'Resíduos Eletrônicos', image: 'eletronico.svg'},
        {title: 'Resíduos Orgânicos', image: 'organico.svg'},
        {title: 'Óleo de Cozinha', image: 'oleo.svg'}
    ])
}