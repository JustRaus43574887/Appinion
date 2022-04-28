import React from 'react';
import {TouchableWithoutFeedback, Keyboard, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Layout} from '@ui-kitten/components';
import Title from './Title';
import Form from './Form';

const Login: React.FC = (): React.ReactElement => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Layout style={styles.wrap}>
          <Title />
          <Form />
        </Layout>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
