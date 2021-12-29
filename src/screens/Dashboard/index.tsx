import React, {useEffect, useState} from 'react';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

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
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard () {
  const [data, setData] = useState<DataListProps[]>([]);

  async function loadTransactions() {
    const dataKey = '@gofinance:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {
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
    setData(transactionsFormatted);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <Container>
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
          amount="R$ 7.000,00"
          lastTransaction="Hoje às 10:00"
          type="up"
        />
        <HighlightCard
          title="Saídas"
          amount="R$ 1.000,00"
          lastTransaction="Hoje às 18:00"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="R$ 6.000,00"
          lastTransaction="Hoje às 18:00"
          type="total"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
}
