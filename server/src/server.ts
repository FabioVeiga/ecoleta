/*
    alta a definicao de tipo
    instalar a dependencia somente para ambiente ded desenvolvimento com o paramentr -D
*/
import express from 'express';
const app = express()

app.get('/users', (req, res) => {
    console.log('Listagem de usuarios')
    //restorando um JSOn
    res.json([
        'Fabio',
        'Luiz',
        'Veiga',
        'teste',
        'Daniel'
    ])
})

app.listen(3333)
