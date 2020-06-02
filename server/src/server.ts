/*
    alta a definicao de tipo
    instalar a dependencia somente para ambiente ded desenvolvimento com o paramentr -D
*/
import express from 'express';
const app = express()

app.use(express.json()) // Como se adicionasse um plugin JSON

//Rota: endereco completo da requisicao e as rotas sao semanticas ou seja ela quer dizer exatamente o que ela quer
//Recurso: entidade
/*
    Get: buscar um ou mais informacoes do backEnd
       Get: http://localhost:3333/users = Listar usuarios
       Get: http://localhost:3333/users/5 Buscar usuario de id 5
    Post: Criar nova informacao do backEnd
    Put: Alterar uma informacao do backEnd
    Delete: Excluir uma informacao do backEnd
*/

const users = [
    'Fabio',
    'Luiz',
    'Veiga',
    'teste',
    'Daniel',
    'Robson',
    'Anderson'
]

//Request Param: Parametro que vem na proprio rota
//Query Param: Sao paramentros que vem na propria rota que geralemente sao opcionais geralmente para filtro, paginacoes e etc
//Request Body: Paramentros que vem no corpo da requisicao
app.get('/users', (req, res) => {
    //quem determina o nome do paremetro eh que esta fazendo a requisicao
    const search = String(req.query.search)
    //a funcao filter return true ou false
    //a funcao includes inclui o objeto
    const filteredusers = search ?  users.filter(user => user.includes(search)) : users
    //retorna um JSOn
    return res.json(filteredusers)
})

app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id)
    const user = users[id]
    return res.json(user)
})

app.post('/users', (req, res) => {
    const data = req.body //armazena na variavel o que vem no corpo
    
    const user = {
        name: data.name,
        email: data.email
    }
    return res.json(user)
})

app.listen(3333)
