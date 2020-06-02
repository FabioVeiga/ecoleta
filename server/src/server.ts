
import express from 'express';
import routes from './routes'

const app = express()

app.use(express.json()) // Como se adicionasse um plugin JSON
app.use(routes) //utiliza routes como modulo

app.listen(3333)
