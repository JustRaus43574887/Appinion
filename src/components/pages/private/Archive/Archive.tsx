import React from 'react';
import {Divider, Layout, List, TopNavigation} from '@ui-kitten/components';
import {TabsParamList} from '../../../../utils/navigation.types';
import {SafeAreaView} from 'react-native-safe-area-context';
import DefaultSubtitle from '../../../navigation/DefaultSubtitle';
import {useApolloClient} from '@apollo/client';
import LIVE_QUERY, {Live} from '../../../../apollo/graphql/queries/live';
import ListItem from '../../../uioverrides/ListItem';
import {wait} from '../../../../utils';
import {useContext} from 'react';
import SocketContext, {Context} from '../../../../context/SocketContext';

const Archive: React.FC = () => {
  const client = useApolloClient();
  const data = client.readQuery<Live>({query: LIVE_QUERY});
  const {archives, getArchives} = useContext<Context>(SocketContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getArchives();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        alignment="center"
        title="Архив"
        subtitle={props => <DefaultSubtitle {...props} data={data} />}
      />
      <Divider />
      <Layout style={{flex: 1}}>
        <List
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={archives}
          renderItem={({index, item}) => (
            <ListItem<keyof TabsParamList>
              key={index}
              item={item}
              param="Archive"
            />
          )}
        />
      </Layout>
    </SafeAreaView>
  );
};

export default Archive;
