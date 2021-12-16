import React from 'react';
import { getBottomSpace } from 'react-native-iphone-x-helper';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

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
  TransactionsList
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard () {
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: "Venda de TV",
      amount: "R$ 1.000,00",
      category: { name: 'Venda', icon: 'shopping-bag'},
      date: "Hoje às 18:00",
    },
    {
      id: '2',
      type: 'negative',
      title: "Jantar",
      amount: "R$ 1.000,00",
      category: { name: 'Alimentação', icon: 'coffee'},
      date: "Hoje às 18:00",
    },
    {
      id: '3',
      type: 'positive',
      title: "Salário",
      amount: "R$ 1.000,00",
      category: { name: 'Salário', icon: 'dollar-sign'},
      date: "Hoje às 18:00",
    },
  ]
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
          <Icon name="power" />
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
