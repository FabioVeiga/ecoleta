import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../services/api'

import './style.css'
import logo from '../../assests/logo.svg'

const CreatePoint = () => {

    //sempre que precisar de uma informacao do componente
    //armazenar num estado
    //sempre que cria um state para um objeto. SEMPRE precisa ajustar manualmente o tipo da varialvel

    //interface eh o formato que o objeto vai ter
    //Interfaces
    interface Item{
        id: number
        title: string
        image_url: string
    }
    interface IBGEUfResponse{
        sigla: string
    }
    interface IBGECityResponse{
        nome: string
    }

    //States
    //quando eh feito a interface e add no useState o objeto se transforma na interfacec
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [inicialPosition, setInicialPosition] = useState<[number, number]>([0,0])
    const [selectedUf, setselectedUf] = useState<string>('0')
    const [selectedCity, setselectedCity] = useState<string>('0')
    const [selectedPosition, setselectedPosition] = useState<[number, number]>([0,0])
    const [selectedItems, setselectedItems] = useState<number[]>([])


    const [formData, setformData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const history = useHistory()


    //Alteracao do states
    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInicials = response.data.map(uf => uf.sigla)
            setUfs(ufInicials)
        })
    } , [])

    useEffect(() => {
        //carregar as cidades sempre que a UF mudar
        if(selectedUf === '0'){
            return
        }
        
        axios
        .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
            const cityNames = response.data.map(city => city.nome)
            setCities(cityNames)
        })
        
    }, [selectedUf])//toda vez que alterar esta funcao sera chamada

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords
            setInicialPosition([latitude, longitude])
        })
    }, [])

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setselectedUf(uf)
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setselectedCity(city)
    }

    function handleMapClick(event: LeafletMouseEvent){
        setselectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target
        //... significa que ele vai copiar tudo que estiver dentro do objeto antes do replace
        //spreadData
        //quando se envolve em concheltes um nove ela vira o nome da varialvel
        setformData({ ...formData, [name]: value})
    }

    function handleSeletedItem(id: number){
        //armazena na variavel se o ID passado ja existe no array
        const alreadySeleted = selectedItems.findIndex(item => item === id)
        //se existe retira
        if(alreadySeleted >= 0){
            //ela vai contar todos os items menos o que precisa remover
            const filteredItems = selectedItems.filter(item => item !== id)
            setselectedItems(filteredItems)
        //senao add
        }else{
            //para nao mudar o state original, deve se "copiar" com o ... o estado e add o novo
            setselectedItems([...selectedItems, id])
        }
    }

    async function handleSubmit(event: FormEvent){
        //para nao alteraar a pagina quando enviar
        event.preventDefault()
        const { name, email, whatsapp } = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longetude] = selectedPosition
        const items = selectedItems
        
        const data = {
            name, email, whatsapp, uf, city, latitude, longetude, items
        }

        await api.post('points', data)

        alert('Ponto de coleta criado')
        history.push('/')
    }

    return(
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input type="email" name="email" id="email" onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp" onChange={handleInputChange}/>
                        </div>
                        </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Enderecos</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    <Map center={inicialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>
                    
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf" 
                                id="uf" 
                                value={selectedUf} 
                                onChange={handleSelectUF}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coletas</h2>
                        <span>Selecione um ou mais Ítens abaixo</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSeletedItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                        
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>

            </form>
        </div>
    )
}

export default CreatePoint