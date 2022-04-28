import {useEffect, useState} from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import type NotificationPopup from 'react-native-push-notification-popup';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackParamList, TabsParamList} from '../../utils/navigation.types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type Props = {
  popupRef: React.RefObject<NotificationPopup>;
};

const useForeground = ({popupRef}: Props) => {
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        BottomTabNavigationProp<TabsParamList>,
        NativeStackNavigationProp<StackParamList>
      >
    >();

  const [currentChatEmail, setCurrentChatEmail] = useState<string>('');
  const [notification, setNotification] =
    useState<FirebaseMessagingTypes.RemoteMessage>();
  const [message, setMessage] = useState<{
    text: string | null;
    iterator: number | undefined;
  } | null>(null);

  const navigateToChat = (
    notification: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    //@ts-ignore
    notification?.data.item &&
      navigation.navigate('Chat', {
        item: notification?.data.item && JSON.parse(notification?.data.item),
        param: 'Incoms',
      });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      setNotification(remoteMessage);
      setMessage({
        text: remoteMessage.notification?.title
          ? remoteMessage.notification?.title
          : null,
        iterator: remoteMessage.sentTime,
      });
      if (currentChatEmail === 'leave') setCurrentChatEmail('');
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (notification && currentChatEmail !== notification.notification?.title)
      popupRef.current?.show({
        onPress: () => navigateToChat(notification),
        appTitle: 'Appinion',
        timeText: 'Сейчас',
        title: notification.notification?.title,
        body: notification.notification?.body,
        slideOutTime: 5000,
      });
  }, [notification]);

  return {message, setCurrentChatEmail};
};

export default useForeground;
