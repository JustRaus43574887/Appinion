import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Chat, Incom} from '../context/SocketContext';

interface ChatProps extends Chat {
  fromNotification?: boolean;
}

export interface StackNavProp<T extends keyof StackParamList> {
  navigation: NativeStackNavigationProp<StackParamList, T>;
}

export interface BottomTabNavProp<T extends keyof TabsParamList> {
  navigation: BottomTabNavigationProp<TabsParamList, T>;
}

export interface CompositeNavProp<T extends keyof TabsParamList> {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabsParamList, T>,
    NativeStackNavigationProp<StackParamList>
  >;
}

export type StackParamList = {
  Home: undefined;
  Chat: ChatProps;
  Video: Incom;
};

export type PublicStackParamList = {
  Login: undefined;
  Forgot: undefined;
};

export type TabsParamList = {
  Incoms: undefined;
  Archive: undefined;
  Profile: undefined;
};
