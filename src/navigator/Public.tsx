import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PublicStackParamList} from '../utils/navigation.types';

import Login from '../components/pages/public/Login/Login';
import Forgot from '../components/pages/public/Forgot/Forgot';

const Stack = createNativeStackNavigator<PublicStackParamList>();

const Public: React.FC = (): React.ReactElement => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Forgot" component={Forgot} />
  </Stack.Navigator>
);

export default Public;
