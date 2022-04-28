import React, {useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackParamList, TabsParamList} from '../utils/navigation.types';
import Incoms from '../components/pages/private/Incoms/Incoms';
import Archive from '../components/pages/private/Archive/Archive';
import Profile from '../components/pages/private/Profile/Profile';
import Chat from '../components/pages/private/Chat/Chat';
import Video from '../components/pages/private/Video/Video';
import BottomTabBar from '../components/navigation/BottomTabBar';
import {SocketContextProvider} from '../context/SocketContext';
import NotificationPopup from 'react-native-push-notification-popup';
import PopupNotification from '../components/navigation/PopupNotification';
import useForeground from '../hooks/notifications/foreground.hook';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator<StackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

const Home: React.FC = () => (
  <Tabs.Navigator
    tabBar={props => <BottomTabBar {...props} />}
    initialRouteName="Incoms"
    screenOptions={{headerShown: false}}>
    <Tabs.Screen name="Incoms" component={Incoms} />
    <Tabs.Screen name="Archive" component={Archive} />
    <Tabs.Screen name="Profile" component={Profile} />
  </Tabs.Navigator>
);

type Props = {
  remoteMessage: FirebaseMessagingTypes.RemoteMessage | null;
};

const Private: React.FC<Props> = ({remoteMessage}) => {
  const popupRef = useRef<NotificationPopup>(null);
  const {message, setCurrentChatEmail} = useForeground({popupRef});

  return (
    <SocketContextProvider
      message={message}
      setCurrentChatEmail={setCurrentChatEmail}>
      <Stack.Navigator
        initialRouteName={
          remoteMessage &&
          //@ts-ignore
          Object.entries(remoteMessage.data).length
            ? 'Chat'
            : 'Home'
        }
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          initialParams={{
            item:
              //@ts-ignore
              remoteMessage?.data.item && JSON.parse(remoteMessage?.data.item),
            param: 'Incoms',
            fromNotification: true,
          }}
        />
        <Stack.Screen name="Video" component={Video} />
      </Stack.Navigator>
      <NotificationPopup
        ref={popupRef}
        renderPopupContent={props => <PopupNotification {...props} />}
        shouldChildHandleResponderMove
        shouldChildHandleResponderStart
      />
    </SocketContextProvider>
  );
};

export default Private;
