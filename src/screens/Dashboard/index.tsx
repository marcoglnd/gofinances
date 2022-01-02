import React, {useCallback, useEffect, useState} from 'react';

import { ActivityIndicator } from 'react-native';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from 'styled-components';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User, 
  UserName,
  UserGreeting,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expense: HighlightProps;
  total: HighlightProps;
}

export function Dashboard () {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [HighlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative',
    ) {
    const lastTransaction = new Date(Math.max.apply(Math,
      collection.filter(transaction => transaction.type === type)
      .map(transaction => new Date(transaction.date).getTime())))
    
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  async function loadTransactions() {
    const dataKey = '@gofinance:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expenseTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {
      if (item.type === 'positive') {
        entriesTotal += Number(item.amount);
      } else {
        expenseTotal += Number(item.amount);
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(item.date));
      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      };
    });
    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpenses = getLastTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionEntries}`;

    const total = entriesTotal - expenseTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      expense: {
        amount: expenseTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: `Última saída dia ${lastTransactionExpenses}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    })
    setIsLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions()
  }, []));

  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large"/>
          </LoadContainer> :
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/65686699?v=4' }} />
                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>Marco</UserName>
                </User>
              </UserInfo>
              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>
          <HighlightCards>
            <HighlightCard
              title="Entradas"
              amount={HighlightData.entries.amount}
              lastTransaction={HighlightData.entries.lastTransaction}
              type="up"
            />
            <HighlightCard
              title="Saídas"
              amount={HighlightData.expense.amount}
              lastTransaction={HighlightData.expense.lastTransaction}
              type="down"
            />
            <HighlightCard
              title="Total"
              amount={HighlightData.total.amount}
              lastTransaction={HighlightData.total.lastTransaction}
              type="total"
            />
          </HighlightCards>
          <Transactions>
            <Title>Listagem</Title>
            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      }
    </Container>
  );
}
