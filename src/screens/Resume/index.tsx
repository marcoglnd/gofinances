import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { VictoryPie } from 'victory-native';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  Month,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  LoadContainer,
} from './styles';

import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';

import { ptBR } from 'date-fns/locale';

import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  color: string;
  total: number;
  totalFormatted: string;
  percent: string;
}

export function Resume () {
  const [isLoading, setIsLoading] = useState(false);
  const [selectDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const theme = useTheme();

  function handleChangeDate(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectDate, 1));
    } else {
      setSelectedDate(subMonths(selectDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = '@gofinance:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];
    
    const expenses = responseFormatted
      .filter((transaction: TransactionData) =>
        transaction.type === 'negative' &&
        new Date(transaction.date).getMonth() === selectDate.getMonth() &&
        new Date(transaction.date).getFullYear() === selectDate.getFullYear(),
      );
    
    const expenseTotal = expenses.reduce((accumulator: number, transaction: TransactionData) => {
      return accumulator + Number(transaction.amount);
    }, 0);
    
    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;
      expenses.forEach((transaction: TransactionData) => {
        if (transaction.category === category.key) {
          categorySum += Number(transaction.amount);
        }
      });

      if(categorySum > 0) {
        const percent = `${(categorySum / expenseTotal * 100).toFixed(0)}%`;
        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormatted: categorySum.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          percent,
        });
      }
    });
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectDate]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      { isLoading ?
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large"/>
        </LoadContainer> :
      <Content
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: useBottomTabBarHeight()
        }}
        showsVerticalScrollIndicator={false}
      >
        <MonthSelect>
          <MonthSelectButton onPress={() => handleChangeDate('prev')}>
            <MonthSelectIcon name="chevron-left" />
          </MonthSelectButton>

          <Month>{format(selectDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

          <MonthSelectButton onPress={() => handleChangeDate('next')}>
            <MonthSelectIcon name="chevron-right" />
          </MonthSelectButton>
        </MonthSelect>

        <ChartContainer>
          <VictoryPie
            data={totalByCategories}
            colorScale={totalByCategories.map((category) => category.color)}
            style={{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape,
              }
            }}
            labelRadius={50}
            x={(datum) => datum.percent}
            y={(datum) => datum.totalFormatted}
          />
        </ChartContainer>
        {totalByCategories.map(item => {
          return (<HistoryCard
            key={item.key}
            title={item.name}
            amount={item.totalFormatted}
            color={item.color}
          />)
        })
        }
      </Content>
      }
    </Container>
  );
};