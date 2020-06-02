import knex from 'knex'
import path from 'path' //retorna no formato padronizando pelo SO

//__dirname varialvel global onded esta o arquivo

const connection = knex({
    client: 'sqlite3', //tipo do banco
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    }
})

export default connection