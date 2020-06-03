import React, { useEffect, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import api from '../../services/api'

import './style.css'
import logo from '../../assests/logo.svg'

const CreatePoint = () => {

    //sempre que precisar de uma informacao do componente
    //armazenar num estado
    //sempre que cria um state para um objeto. SEMPRE precisa ajustar manualmente o tipo da varialvel

    //interface eh o formato que o objeto vai ter
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

    //quando eh feito a interface e add no useState o objeto se transforma na interfacec
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [selectedUf, setselectedUf] = useState<string>('0')
    const [cities, setCities] = useState<string[]>([])

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

    function handleSelectUF(event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setselectedUf(uf)
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
            <form>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name"/>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="name">E-mail</label>
                            <input type="email" name="email" id="email"/>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp"/>
                        </div>
                        </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Enderecos</h2>
                        <span>Selecione um endereço no mapa</span>
                    </legend>

                    <Map center={[43.6963591, -79.2789415]} zoom={15}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[43.6963591, -79.2789415]} />
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
                            <select name="city" id="city">
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
                            <li key={item.id}>
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