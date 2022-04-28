import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
  from,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createUploadLink} from 'apollo-upload-client';

import {apiEndpoint} from '../../utils/constants';

const uploadLink = createUploadLink({
  uri: apiEndpoint,
});

const httpLink = new HttpLink({
  uri: apiEndpoint,
});

const authLink = setContext(async (_, {headers}) => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  //@ts-ignore
  link: from([authLink, uploadLink, httpLink]),
  cache: new InMemoryCache(),
  assumeImmutableResults: true,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
