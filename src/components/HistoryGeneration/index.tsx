import React from "react";

import { Container, Tag } from './styles';

interface IHistoryGenerationProps {
    tagColor: string;
    title: string;
    subtitle: string;
    amount: string;


}

const HistoryGeneration: React.FC<IHistoryGenerationProps> = ({
    
    tagColor,
    title,
    subtitle,
    amount

}) => 

    (
        <Container>
            <Tag color={tagColor} />
            <div>
                <span>{title}</span>
                <small>{subtitle}</small>
            </div>
            <h3>{amount}</h3>
        </Container>
        
    );


export default HistoryGeneration;
