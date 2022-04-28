import React, {Suspense} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Public from './Public';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Private from './Private';
import ErrorBoundary from '../components/loaders/ErrorBoundary';
import Preloader from '../components/loaders/Preloader';
import {useQuery} from '@apollo/client';
import LIVE_QUERY, {Live} from '../apollo/graphql/queries/live';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

type Props = {
  remoteMessage: FirebaseMessagingTypes.RemoteMessage | null;
};

const Navigator: React.FC<Props> = ({remoteMessage}) => {
  const {data, loading} = useQuery<Live>(LIVE_QUERY);

  if (loading) return <Preloader />;

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <Suspense fallback={<Preloader />}>
            {data?.live ? (
              <Private remoteMessage={remoteMessage} />
            ) : (
              <Public />
            )}
          </Suspense>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default Navigator;
