import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import { Link } from 'react-router-dom'//SPA = Single Page carrada de forma ded componente

import './style.css'
import logo from '../../assests/logo.svg'

const Home = () => {
    return(
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta"/>
                </header>
                <main>
                    <h1>Seu marketplace de coleta de residuos.</h1>
                    <p>Ajudamos as pessoas a encotrarem pontos de coleta de forma eficiente.</p>
                    
                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto ded coleta</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home