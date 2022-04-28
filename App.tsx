import React from 'react';
import {StyleSheet} from 'react-native';
import {ApplicationProvider, IconRegistry, Layout} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import Navigator from './src/navigator/Navigator';
import {default as customTheme} from './custom-theme.json';
import {default as mapping} from './mapping.json';
import {client} from './src/apollo/startup';
import {ApolloProvider} from '@apollo/client';
import {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import InterfaceBars from './src/components/navigation/InterfaceBars';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useState} from 'react';

export default (): React.ReactFragment => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const [remoteMessage, setRemoteMessage] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => remoteMessage && setRemoteMessage(remoteMessage));
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{...eva.light, ...customTheme}}
        customMapping={mapping}>
        <InterfaceBars />
        <ApolloProvider client={client}>
          <Layout style={styles.container}>
            <Navigator remoteMessage={remoteMessage} />
          </Layout>
        </ApolloProvider>
      </ApplicationProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
