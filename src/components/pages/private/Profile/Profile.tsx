import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import {
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import User from './User';
import Inputs from './Inputs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useApolloClient, useMutation} from '@apollo/client';
import LIVE_QUERY, {Live} from '../../../../apollo/graphql/queries/live';
import LOGOUT_MUTATION, {
  Logout,
  LogoutVars,
} from '../../../../apollo/graphql/mutations/logout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {show} from '../../../../utils/snackbar';
import UPDATE_VIDEO_MUTATION from '../../../../apollo/graphql/mutations/updateVideoWidget';
import Button from '../../../uioverrides/Button';
import messaging from '@react-native-firebase/messaging';
import {BottomTabNavProp} from '../../../../utils/navigation.types';
import DefaultSubtitle from '../../../navigation/DefaultSubtitle';

interface Props extends BottomTabNavProp<'Profile'> {}

export type TForm = {
  name?: string;
  position?: string;
  online?: boolean;
};

const Profile: React.FC<Props> = ({navigation}) => {
  const client = useApolloClient();
  const data = client.readQuery<Live>({query: LIVE_QUERY});

  const [showSave, setShowSave] = useState<boolean>(false);
  const [form, setForm] = useState<TForm>({
    name: '',
    position: '',
    online: true,
  });

  const [logoutLive, result] = useMutation<Logout, LogoutVars>(LOGOUT_MUTATION);

  const logout = () => {
    messaging()
      .getToken()
      .then(fcmToken => {
        logoutLive({variables: {fcmToken}}).then(() => {
          AsyncStorage.removeItem('token').then(() => {
            client.reFetchObservableQueries();
          });
        });
      });
  };

  useEffect(() => {
    if (result.error && !result.data?.loginLive)
      show({text: 'Ошибка сервера!', type: 'error'});
  }, [result.error]);

  const renderRightActions = () => (
    <TopNavigationAction
      disabled={result.loading}
      onPress={logout}
      icon={props => <Icon {...props} name="log-out-outline" />}
    />
  );

  const handleSave = () => save();

  const renderLeftActions = useCallback(
    () =>
      showSave ? (
        <Button
          appearance="ghost"
          disabled={loading}
          onPress={handleSave}
          size="small"
          style={{borderRadius: 50}}>
          Сохранить
        </Button>
      ) : (
        <Fragment />
      ),
    [showSave],
  );

  useEffect(() => {
    setForm({...data?.live});
  }, [data]);

  const [save, {loading}] = useMutation(UPDATE_VIDEO_MUTATION, {
    variables: {
      id: data?.live?._id,
      form: {
        name: form.name,
        position: form.position,
        online: form.online,
        host: data?.live?.host,
      },
    },
    update: (cache, {data, errors}) => {
      Keyboard.dismiss();
      if (errors) {
        show({text: errors[0].message, type: 'error'});
        return;
      }
      cache.writeQuery<Live>({
        query: LIVE_QUERY,
        data: {live: data.updateVideoWidget},
      });
      show({text: 'Успешно!', type: 'success'});
      client.reFetchObservableQueries();
    },
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Layout style={{flex: 1}}>
          <TopNavigation
            title="Профиль"
            alignment="center"
            subtitle={props => <DefaultSubtitle {...props} data={data} />}
            accessoryRight={renderRightActions}
            accessoryLeft={renderLeftActions}
          />
          <User data={data} />
          <Inputs
            data={data}
            form={form}
            setForm={setForm}
            setShowSave={setShowSave}
          />
        </Layout>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Profile;
