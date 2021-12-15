import React from 'react';

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
} from './styles';

export function Dashboard () {
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
    </Container>
  );
}
