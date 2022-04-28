import React, {useState, useEffect, Fragment} from 'react';
import {ImageProps, View} from 'react-native';
import {show} from '../../../../utils/snackbar';
import {TouchableWithoutFeedback} from 'react-native';

import {Input, Layout, Icon, Spinner} from '@ui-kitten/components';

import {useApolloClient, useMutation} from '@apollo/client';
import LOGIN_MUTATION, {
  Login,
  LoginVars,
} from '../../../../apollo/graphql/mutations/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Button from '../../../uioverrides/Button';

const Form: React.FC = (): React.ReactElement => {
  //form control
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secure, setSecure] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleChangeLogin = (text: string) => setLogin(text);
  const handleChangePassword = (text: string) => setPassword(text);

  useEffect(() => {
    if (login && password) setDisabled(false);
    else setDisabled(true);
  }, [login, password]);

  //data fetching
  const client = useApolloClient();

  const [loginLive, {error, loading}] = useMutation<Login, LoginVars>(
    LOGIN_MUTATION,
    {
      update: async (_, {data}) => {
        const token = data?.loginLive || '';
        await AsyncStorage.setItem('token', token);
        client.reFetchObservableQueries();
      },
    },
  );

  //errors handler
  useEffect(() => {
    if (error) show({text: error.message, type: 'error'});
  }, [error]);

  const handleLogin = async () =>
    loginLive({
      variables: {
        form: {
          login: login.toLowerCase().trim(),
          password: password.trim(),
          fcmToken: await messaging().getToken(),
        },
      },
    });

  const toggleSecure = () => setSecure(!secure);

  const renderIcon = (
    props?: Partial<ImageProps>,
  ): React.ReactElement<ImageProps> => (
    <TouchableWithoutFeedback onPress={toggleSecure}>
      <Icon {...props} name={secure ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout style={{padding: 20, width: '100%'}}>
      <Input
        style={{marginTop: 10}}
        status="primary"
        label="Логин"
        value={login}
        onChangeText={handleChangeLogin}
        textContentType="givenName"
      />
      <Input
        style={{marginTop: 10}}
        status="primary"
        label="Пароль"
        value={password}
        onChangeText={handleChangePassword}
        secureTextEntry={secure}
        textContentType="password"
        accessoryRight={renderIcon}
      />

      <Button
        disabled={disabled}
        appearance={loading ? 'outline' : 'filled'}
        accessoryLeft={props =>
          loading ? (
            <View {...props}>
              <Spinner size="small" />
            </View>
          ) : (
            <Fragment />
          )
        }
        onPress={handleLogin}
        style={{marginTop: 26}}>
        Далее
      </Button>
    </Layout>
  );
};

export default Form;
