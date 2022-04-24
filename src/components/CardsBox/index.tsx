import React, { useMemo } from 'react';
import CountUp from 'react-countup';

import energia from '../../assets/energia.svg';

import vento from '../../assets/vento.svg';
import solar from '../../assets/solar.svg'

import { Container }  from './styles';

interface ICardsBoxProps {
    title: string;
    amount: number;
    footerlabel: string;
    icon: 'energia' | 'solar' | 'vento';
    color: string;
}

const CardsBox: React.FC<ICardsBoxProps> = ({
    title,
    amount,
    footerlabel,
    icon,
    color
}) => {

    const iconSelected = useMemo(() => {
        switch (icon) {
            case 'energia':
                return energia;
            case 'solar': 
                return solar;
            case 'vento':
                return vento;
            default:
              return undefined;
        }
    },[icon]);

    return (
        <Container color={color}>
            <span>{title}</span>
            <h1>
                <strong>Kwh </strong>
                <CountUp 
                    end={amount}
                    separator="."
                    decimal=","
                    decimals={2}                                    
                />
            </h1>
            <small>{footerlabel}</small>
            <img src={iconSelected} alt={title} />
        </Container>
    );
}

export default CardsBox;