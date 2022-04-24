/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useMemo, useState, useEffect} from "react";
import { uuid } from "uuidv4";

import ContentHeader from "../../components/ContentHeader";
import SelectInput from "../../components/SelectInput";
import HistoryGeneration from "../../components/HistoryGeneration";

import {useParams} from 'react-router-dom';

import eolica from "../../repositories/eolica";
import solar from "../../repositories/solar";
import fortmatCurrency from "../../utils/formatCurrency";
import formatDate from "../../utils/fotmatDate";
import listOfMonths from "../../utils/months";

import { Container, Content, Filters } from './styles';


interface IData {
    id: string;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC = () => {

    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSetected] = useState<number>(new Date().getMonth() + 1 );
    const [yearSelected, setYearSetected] = useState<number>(new Date().getFullYear());
    const [selectedFrequency, setSelectedFrequency] = useState(['recorrente', 'eventual']);
    

    const { type } = useParams();

    const title = useMemo(() => {
        return type === 'generation-eolica' ? 'Geração Eolica' : 'Geração Solar'
    },[type]);

    const lineColor = useMemo(() => {
        return type === 'generation-eolica' ? 'Geração #E44C4E' : '#F7931B Solar'
    },[type]);
    const listData = useMemo(() => {
        return type === 'generation-eolica' ? eolica : solar;
    },[type]);

    

   const years = useMemo(() => {
    let uniqueYears: number[] = []

    listData.forEach(item => {
        const date = new Date(item.date)
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

  },[listData]);

  const months = useMemo(() => {
   return listOfMonths.map((month, index) => {
    return {
        value: index + 1,
        label: month,
    }

   });
  },[]);

  const handleFrenquencyClick = (frequency: string) => {
        const alreadySelected = selectedFrequency.findIndex(item => item === frequency);

        if(alreadySelected >= 0){
            const filtered = selectedFrequency.filter(item => item !== frequency)
            setSelectedFrequency(filtered);
        }else {
            setSelectedFrequency((prev) => [...prev, frequency ]);
        }
  }

  const handleMonthSelected = (month: string) => {
      try {
        const parseMonth = Number(month);
        setMonthSetected(parseMonth);
      }
      catch(error) {
          throw new Error('invalid format month. Is accept 0 - 24')
      }
  }

  const handleYearSelected = (year: string) => {
    try {
      const parseYear = Number(year);
      setYearSetected(parseYear);
    }
    catch(error) {
        throw new Error('invalid format Year. Is accept integer number')
    }
}

    useEffect(() => {
        const filteredData = listData.filter(item => {
        const date = new Date(item.date)
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

            return month === monthSelected && year === yearSelected && selectedFrequency.includes(item.frequency);
       });

       const formattedData = filteredData.map(item => {
            return {
                id: uuid(),
                description: item.description,
                amountFormatted: fortmatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formatDate (item.date),
                tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E'
            }
        })
        setData(formattedData);

    },[listData, monthSelected, yearSelected, data.length, selectedFrequency]);

    return (
        <Container>
            <ContentHeader title="{title}" lineColor={lineColor}>
                <SelectInput options={months} 
                onChange={(e) => handleMonthSelected(e.target.value)} 
                defaultValue={monthSelected} />
                <SelectInput options={years} 
                onChange={(e) => handleYearSelected(e.target.value)}  
                defaultValue={yearSelected}/>
            </ContentHeader>

            <Filters>
                <button 
                 
                    type="button"
                    className={`tag-filter tag-filter-recurrent
                    ${selectedFrequency.includes('recorrents') && 'tag-actived'}`}
                    onClick={() => handleFrenquencyClick('recorrente')}
                >
                    Recorrentes
                </button>

                <button 
                
                type="button"
                className={`tag-filter tag-filter-eventual
                ${selectedFrequency.includes('eventual') && 'tag-actived'}`}
                onClick={() => handleFrenquencyClick('eventual')}
            >
                Recorrentes
            </button>
            </Filters>

            <Content>
                {
                   data.map(item => (
                        <HistoryGeneration 
                            key={item.id}
                            tagColor={item.tagColor}
                            title={item.description}
                            subtitle={item.dateFormatted}
                            amount={item.amountFormatted}
                        / > 
                    )) 
                }
            </Content>
        </Container>
    );
}

export default List;