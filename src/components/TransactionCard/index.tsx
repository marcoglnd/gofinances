import React from 'react';
import { categories } from '../../utils/categories';

import {
  Container,
  Title,
  Icon,
  Footer,
  Amount,
  CategoryName,
  Category,
  Date,
} from './styles';

interface Category {
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

export function TransactionCard( { data: { type, name, amount, category, date } } : Props) {
  const [categoryFound] = categories.filter(
    (item) => item.key === category,
  );
  return (
    <Container>
      <Title>{name}</Title>
      <Amount type={type}>
        {type === 'negative' && '- '}
        {amount}
      </Amount>
      <Footer>
        <Category>
          <Icon name={categoryFound.icon}/>
          <CategoryName>{categoryFound.name}</CategoryName>
        </Category>
        <Date>{date}</Date>
      </Footer>
    </Container>
  );
};