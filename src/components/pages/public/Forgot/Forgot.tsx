import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {PublicStackParamList} from '../../../../utils/navigation.types';

type Props = {
  navigation: NativeStackNavigationProp<PublicStackParamList, 'Forgot'>;
};

const Forgot: React.FC<Props> = ({navigation}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Forgot</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default Forgot;
