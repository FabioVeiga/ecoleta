
import express from 'express'
import cors from 'cors'
import routes from './routes'
import path from 'path'

const app = express()

app.use(cors())
app.use(express.json()) // Como se adicionasse um plugin JSON
app.use(routes) //utiliza routes como modulo

app.use('/uploads', express.static(path.resolve(__dirname, "..", "uploads")))//acessando items estaticos

app.listen(3333)
