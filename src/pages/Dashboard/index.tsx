import React, { useState, useMemo, useCallback } from 'react';


import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import CardsBox from '../../components/CardsBox';
import MessageBox from '../../components/MessageBox';
import PieChartBox from '../../components/PieChartBox';
import HistoryBox from '../../components/HistoryBox';
import BarChartBox from '../../components/BarChartBox'

import solar from '../../repositories/solar';
import eolica from '../../repositories/eolica';
import listOfMonths from '../../utils/months';

import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/sad.svg';
import grinningImg from '../../assets/grinning.svg';
import opsImg from '../../assets/ops.svg';


import { 
    Container,
    Content, 
} from './styles';


const Dashboard: React.FC = () => {
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());


    const years = useMemo(() => {
        let uniqueYears: number[] = [];

        [...solar, ...eolica].forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();

            if(!uniqueYears.includes(year)){
                uniqueYears.push(year)
           }
        });

        return uniqueYears.map(year => {
            return {
                value: year,
                label: year,
            }
        });
    },[]);


    const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    },[]);
    
    
    const totalSolar = useMemo(() => {
        let total: number = 0;

        solar.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if(month === monthSelected && year === yearSelected){
                try{
                    total += Number(item.amount)
                }catch{
                    throw new Error('Invalid amount! Amount must be number.')
                }
            }
        });

        return total;
    },[monthSelected, yearSelected]);


    const totalEolica = useMemo(() => {
        let total: number = 0;

        eolica.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if(month === monthSelected && year === yearSelected){
                try{
                    total += Number(item.amount)
                }catch{
                    throw new Error('Invalid amount! Amount must be number.')
                }
            }
        });

        return total;
    },[monthSelected, yearSelected]);

    const totalBalance = useMemo(() => {
        return totalEolica + totalSolar;
    },[totalEolica, totalSolar]);

    const message = useMemo(() => {
        if(totalBalance < 0){
            return {
                title: "Que triste!",
                description: "Neste mês, Não gerou a Energia Esperada.",
                footerText: "Verifique os equipamentos.",
                icon: sadImg
            }
        }      
        else if(totalEolica === 0 && totalSolar === 0){
            return {
                title: "Op's!",
                description: "Neste mês, não há registros de Geração de Energia.",
                footerText: "Verifique os equipamentos.",
                icon: opsImg
            }
        }
        else if(totalBalance === 0){
            return {
                title: "Alerta! ",
                description: "Neste mês, Nãogerou nada.",
                footerText: "Verifique os equipamentos",
                icon: grinningImg
            }
        }
        else{
            return {
                title: "Muito bem!",
                description: "Esse Mes gerou muita energia",
                footerText: "Equipamentos Funcionando Dentro do esperado.",
                icon: happyImg
            }
        }

    },[totalBalance, totalEolica, totalSolar]);

    const relationSolarVersusEolica = useMemo(() => {
        const total = totalEolica + totalSolar;

        const percentEolica = Number(((totalEolica / total) * 100).toFixed(1));
        const percentSolar = Number(((totalSolar / total) * 100).toFixed(1));

        const data = [
            {
                name: "Eolica",
                value: totalEolica,
                percent: percentEolica ? percentEolica : 0, 
                color: '#E44C4E'
            },
            {
                name: "Solar",
                value: totalSolar,
                percent: percentSolar ? percentSolar : 0, 
                color: '#F7931B'
            },
        ];

        return data;
    },[totalEolica, totalSolar]);

    const historyData = useMemo(() => {
        return listOfMonths
        .map((_, month) => {
            
            let amountEntry = 0;
            eolica.forEach(eolica => {
                const date = new Date(eolica.date);
                const eolicaMonth = date.getMonth();
                const eolicaYear = date.getFullYear();

                if(eolicaMonth === month && eolicaYear === yearSelected){
                    try{
                        amountEntry += Number(eolica.amount);
                    }catch{
                        throw new Error('amountEntry is invalid. amountEntry must be valid number.')
                    }
                }
            });

            let amountOutput = 0;
            solar.forEach(solar => {
                const date = new Date(solar.date);
                const solarMonth = date.getMonth();
                const solarYear = date.getFullYear();

                if(solarMonth === month && solarYear === yearSelected){
                    try{
                        amountOutput += Number(solar.amount);
                    }catch{
                        throw new Error('amountOutput is invalid. amountOutput must be valid number.')
                    }
                }
            });


            return {
                monthNumber: month,
                month: listOfMonths[month].substr(0, 3),
                amountEntry,
                amountOutput
            }
        })
        .filter(item => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            return (yearSelected === currentYear && item.monthNumber <= currentMonth) || (yearSelected < currentYear)
        });
    },[yearSelected]);

    const relationSolarRecurrentVersusEventual = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;

        solar
        .filter((solar) => {
            const date = new Date(solar.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            return month === monthSelected && year === yearSelected;
        })
        .forEach((solar) => {
            if(solar.frequency === 'recorrente'){
                return amountRecurrent += Number(solar.amount);
            }

            if(solar.frequency === 'eventual'){
                return amountEventual += Number(solar.amount);
            }
        });

        const total = amountRecurrent + amountEventual;

        const percentRecurrent = Number(((amountRecurrent / total) * 100).toFixed(1));
        const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));

        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: percentRecurrent ? percentRecurrent : 0, 
                color: "#F7931B"
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: percentEventual ? percentEventual : 0,
                color: "#E44C4E"
            }
        ];
    },[monthSelected, yearSelected]);


    const relationEolicaRecurrentVersusEventual = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;

        eolica
        .filter((eolica) => {
            const date = new Date(eolica.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            return month === monthSelected && year === yearSelected;
        })
        .forEach((eolica) => {
            if(eolica.frequency === 'recorrente'){
                return amountRecurrent += Number(eolica.amount);
            }

            if(eolica.frequency === 'eventual'){
                return amountEventual += Number(eolica.amount);
            }
        });

        const total = amountRecurrent + amountEventual;

        const percentRecurrent = Number(((amountRecurrent / total) * 100).toFixed(1));
        const percentEventual = Number(((amountEventual / total) * 100).toFixed(1));

        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: percentRecurrent ? percentRecurrent : 0,
                color: "#F7931B"
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: percentEventual ? percentEventual : 0,
                color: "#E44C4E"
            }
        ];
    },[monthSelected, yearSelected]);

    const handleMonthSelected = useCallback((month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        }
        catch{
            throw new Error('invalid month value. Is accept 0 - 24.')
        }
    },[]);


    const handleYearSelected = useCallback((year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        }
        catch{
            throw new Error('invalid year value. Is accept integer numbers.')
        }
    },[]);


    return (
        <Container>
            <ContentHeader title="Dashboard" lineColor="#F7931B">
                <SelectInput 
                    options={months}
                    onChange={(e) => handleMonthSelected(e.target.value)} 
                    defaultValue={monthSelected}
                />
                <SelectInput 
                    options={years} 
                    onChange={(e) => handleYearSelected(e.target.value)} 
                    defaultValue={yearSelected}
                />
            </ContentHeader>

            <Content>
                <CardsBox 
                    title="Total Gerado"
                    color="#4E41F0"
                    amount={totalBalance}
                    footerlabel="atualizado com base nas entradas e saídas"
                    icon="energia"
                />

                <CardsBox 
                    title="Energia Solar"
                    color="#F7931B"
                    amount={totalEolica}
                    footerlabel="atualizado com base nas entradas e saídas"
                    icon="solar"
                />

                <CardsBox 
                    title="Energia Eolica"
                    color="#E44C4E"
                    amount={totalSolar}
                    footerlabel="atualizado com base nas entradas e saídas"
                    icon="vento"
                />

                <MessageBox
                    title={message.title}
                    description={message.description}
                    footerText={message.footerText}
                    icon={message.icon}
                />

                <PieChartBox data={relationSolarVersusEolica} />

                <HistoryBox 
                    data={historyData} 
                    lineColorAmountEntry="#F7931B"
                    lineColorAmountOutput="#E44C4E"
                />

                <BarChartBox 
                    title="Saídas"
                    data={relationSolarRecurrentVersusEventual} 
                />
                
                <BarChartBox 
                    title="Entradas"
                    data={relationEolicaRecurrentVersusEventual} 
                />
                
            </Content>
        </Container>
    );
}

export default Dashboard;