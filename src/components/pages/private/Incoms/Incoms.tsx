import React from 'react';
import {Divider, Layout, List, TopNavigation} from '@ui-kitten/components';
import {
  CompositeNavProp,
  TabsParamList,
} from '../../../../utils/navigation.types';
import {useApolloClient} from '@apollo/client';
import LIVE_QUERY, {Live} from '../../../../apollo/graphql/queries/live';
import {SafeAreaView} from 'react-native-safe-area-context';
import DefaultSubtitle from '../../../navigation/DefaultSubtitle';
import ListItem from '../../../uioverrides/ListItem';
import {useContext} from 'react';
import SocketContext, {Context} from '../../../../context/SocketContext';
import {wait} from '../../../../utils';

interface Props extends CompositeNavProp<'Incoms'> {}

const Incoms: React.FC<Props> = ({navigation}): React.ReactElement => {
  const client = useApolloClient();
  const data = client.readQuery<Live>({query: LIVE_QUERY});
  const {incoms, getIncoms} = useContext<Context>(SocketContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getIncoms();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        alignment="center"
        title="Входящие заявки"
        subtitle={props => <DefaultSubtitle {...props} data={data} />}
      />
      <Divider />
      <Layout style={{flex: 1}}>
        <List
          refreshing={refreshing}
          onRefresh={onRefresh}
          data={incoms}
          renderItem={({index, item}) => (
            <ListItem<keyof TabsParamList>
              key={index}
              item={item}
              param="Incoms"
            />
          )}
        />
      </Layout>
    </SafeAreaView>
  );
};

export default Incoms;
