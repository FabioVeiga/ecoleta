import {Request, Response} from 'express'
import knex from '../database/conexion'

class ItemsController{

    async index(req: Request, res: Response){
        const items = await knex('items').select('*')
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.0.112:3333/uploads/${item.image}`
            }
        }) //transforma os dados para um novo formato
        return res.json(serializedItems)
    }

}

export default ItemsController