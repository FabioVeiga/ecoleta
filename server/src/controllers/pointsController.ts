import {Request, Response} from 'express'
import knex from '../database/conexion'

class PointsController{
    //tera os methods
    async index(req: Request, res: Response){
        //cidade, uf, items (Query paramars)
        const {city, uf, items} = req.query
        
        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()))
        
        const points = await knex('points')
        .join('points_items', 'points.id', '=', 'points_items.point_id')
        .whereIn('points_items.item_id', parsedItems) //que tem pelo menos o que esta no filtro
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        const serializedPoints = points.map(point => {
            return {
               ...point,
                image_url: `http://192.168.0.112:3333/uploads/${point.image}`
            }
        }) //transforma os dados para um novo formato

        return res.json(serializedPoints)
    }

    async show(req: Request, res: Response){
        const { id } = req.params

        const point = await knex('points').where('id', id).first()

        if(!point){
            return res.status(400).json({message: 'Point is not found'})
        }

        const items = await knex('items')
        .join('points_items', 'items.id', "=", "points_items.item_id")
        .where('points_items.point_id', id)
        .select('items.title')

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.112:3333/uploads/${point.image}`
        }

        return res.json({
            point: serializedPoint,
            items
        })
    }

    async create(req: Request, res: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longetude,
            uf,
            city,
            items,
            image
        } = req.body
    
        //se alguma execuxao falar nao tera registros inseridos
        const trx = await knex.transaction();

        const point = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longetude,
            uf,
            city
        }
        
        const insertedId = await trx('points').insert(point)
    
        const point_id = insertedId[0]
    
        const pointItems = items
        .split(',')
        .map((item: string ) => Number(item.trim()))
        .map((item_id : number) => {
            return{
                item_id,
                point_id
            }
        })
    
        await trx('points_items').insert(pointItems)

        await trx.commit()
        
        return res.json({
            id: point_id,
            ...point
        })
    }
}

export default PointsController