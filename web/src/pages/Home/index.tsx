import React from 'react'
import { FiLogIn } from 'react-icons/fi'

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

                    <a href="/cadastro">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um ponto ded coleta</strong>
                    </a>
                </main>
            </div>
        </div>
    )
}

export default Home