import React from "react";

import {GiWindTurbine, GiSolarPower} from 'react-icons/gi';
import {MdDashboard, MdExitToApp} from 'react-icons/md';

import { Link } from "react-router-dom";

import LogoImg from '../../assets/Logo.png';

import {useAuth} from '../../hooks/auth';

import { Container, Header, LogImg, Title , MenuContainer, MenuItemButton } from './styles';

const Aside: React.FC = () => {
    const { signOut } = useAuth();

    return (
        <Container>
            <Header>
                <LogImg src={LogoImg} alt="Logo da Delfos"/>
                <Title>DashBoard Eolica/Solar</Title>
            </Header>
            <MenuContainer>
                <Link to="/">
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

                <MenuItemButton onClick={signOut}>
                    <MdExitToApp />
                    Sair
                </MenuItemButton>
            </MenuContainer>
        </Container>
        
    );
}

export default Aside;
