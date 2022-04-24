import React from "react";

import {GiWindTurbine, GiSolarPower} from 'react-icons/gi';
import {MdDashboard, MdExitToApp} from 'react-icons/md';

import { Link } from "react-router-dom";

import LogoImg from '../../assets/Logo.png';

import { Container, Header, LogImg, Title , MenuContainer } from './styles';

const Aside: React.FC = () => {

    return (
        <Container>
            <Header>
                <LogImg src={LogoImg} alt="Logo da Delfos"/>
                <Title>DashBoard Eolica/Solar</Title>
            </Header>
            <MenuContainer>
                <Link to="/dashboard">
                    <MdDashboard />
                    DashBoard
                </Link>

                <Link to="/list/generation-eolica">
                    <GiWindTurbine />
                    Geração Eolica
                </Link>

                <Link to="/list/generation-solar">
                    <GiSolarPower />
                    Geração Solar
                </Link>

                <Link to="exit-generation">
                    <MdExitToApp />
                    Sair
                </Link>
            </MenuContainer>
        </Container>
        
    );
}

export default Aside;
