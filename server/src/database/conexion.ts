import knex from 'knex'
import path from 'path' //retorna no formato padronizando pelo SO

//__dirname varialvel global onde esta a raiz do diretorio

const connection = knex({
    client: 'sqlite3', //tipo do banco
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
})

export default connection