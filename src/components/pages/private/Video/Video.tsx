import React, {useEffect, useRef} from 'react';
import {StatusBar, Alert, TouchableOpacity, View} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../../utils/navigation.types';
import {Icon, Layout, List, Spinner, useTheme} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import InputToolbar from '../../../uioverrides/InputToolbar';
import {useContext} from 'react';
import SocketContext, {Context} from '../../../../context/SocketContext';
import Message from '../Chat/message/Message';
import WebRTCView from './WebRTCView';

export interface NavigationProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Video'>;
  route: RouteProp<StackParamList, 'Video'>;
}

const Video: React.FC<NavigationProps> = ({navigation, route}) => {
  const theme = useTheme();
  const {messages, stream, endCall, getMessages} =
    useContext<Context>(SocketContext);

  useEffect(() => {
    changeNavigationBarColor('black', false, true);
    return () => {
      changeNavigationBarColor(theme['color-basic-100'], true, false);
      getMessages(route.params.id);
    };
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      Alert.alert(
        'Завершить трансляцию?',
        'Вы сможете создать новый сеанс в любой момент.',
        [
          {text: 'Остаться', style: 'cancel', onPress: () => {}},
          {
            text: 'Завершить',
            style: 'destructive',
            onPress: () => {
              if (navigation.canGoBack()) {
                navigation.dispatch(e.data.action);
                endCall(route.params.id);
              }
            },
          },
        ],
      );
    });
    return () => {
      navigation.removeListener('beforeRemove', () => {});
    };
  }, [navigation]);

  const goBack = () => navigation.canGoBack() && navigation.goBack();

  const BackButton: React.FC = () => (
    <TouchableOpacity onPress={goBack}>
      <Icon
        name="arrow-ios-back-outline"
        style={{width: 25, height: 25}}
        fill={theme['color-basic-100']}
      />
    </TouchableOpacity>
  );

  useEffect(() => {
    InCallManager.setSpeakerphoneOn(true);
    InCallManager.setKeepScreenOn(true);
    return () => {
      InCallManager.setSpeakerphoneOn(false);
      InCallManager.setKeepScreenOn(false);
    };
  }, []);

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Layout
          style={{
            flex: 1,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {stream ? <WebRTCView /> : <Spinner size="small" status="warning" />}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: 15,
              position: 'absolute',
              top: 0,
            }}>
            <BackButton />
          </View>

          <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
            <List
              inverted
              style={{
                height: 200,
                backgroundColor: 'transparent',
              }}
              data={messages}
              renderItem={({index, item}) => (
                <Message
                  key={index}
                  message={item}
                  email={route.params.email}
                />
              )}
            />
            <InputToolbar id={route.params.id} transparent />
          </View>
        </Layout>
      </SafeAreaView>
    </>
  );
};

export default Video;
