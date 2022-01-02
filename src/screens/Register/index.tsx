import React, { useState } from 'react';

import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';

import {useForm} from 'react-hook-form';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import AsyncStorage from '@react-native-async-storage/async-storage';

import uuid from 'react-native-uuid';

import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  amount: Yup
  .number()
  .typeError('Informe um valor numérico')
  .positive('Informe um valor positivo')
  .required('Valor é obrigatório')
});

export function Register() {
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const dataKey = '@gofinance:transactions';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({resolver: yupResolver(schema)});

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal () {
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal () {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if(!transactionType) return Alert.alert('Erro', 'Selecione um tipo de transação');

    if(category.key === 'category') return Alert.alert('Erro', 'Selecione uma categoria');

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    }

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [
        ...currentData,
        newTransaction
      ];
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      })
      navigate('Listagem');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Ocorreu um erro ao registrar a transação');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <InputForm
            name="name"
            control={control}
            placeholder="Nome"
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
          />
          <InputForm
            name="amount"
            control={control}
            placeholder="Preço"
            keyboardType="numeric"
            error={errors.amount && errors.amount.message}
          />
          <TransactionTypes>
            <TransactionTypeButton
              type="up"
              title="income"
              onPress={() => handleTransactionTypeSelect('positive')}
              isActive={transactionType === 'positive'}
            />
            <TransactionTypeButton
              type="down"
              title="outcome"
              onPress={() => handleTransactionTypeSelect('negative')}
              isActive={transactionType === 'negative'}
            />
          </TransactionTypes>
          <CategorySelectButton
            title={category.name}
            onPress={handleOpenSelectCategoryModal}
          />
        </Fields>
        <Button
          title="Enviar"
          onPress={handleSubmit(handleRegister)}
        />
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
    </TouchableWithoutFeedback>
  );
}