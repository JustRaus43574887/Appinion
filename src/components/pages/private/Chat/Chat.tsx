import React, {Fragment, useEffect, useRef} from 'react';
import {
  Animated,
  ImageProps,
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Icon,
  Layout,
  List,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from '@ui-kitten/components';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  StackParamList,
  TabsParamList,
} from '../../../../utils/navigation.types';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import InputToolbar from '../../../uioverrides/InputToolbar';
import Message from './message/Message';
import {useContext} from 'react';
import SocketContext, {
  Archive,
  Context,
} from '../../../../context/SocketContext';
import Preloader from '../../../loaders/Preloader';
import {useCallback} from 'react';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {useState} from 'react';
// import CircleButton from '../../../uioverrides/CircleButton';

interface Props {
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<StackParamList, 'Chat'>,
    BottomTabNavigationProp<TabsParamList>
  >;
  route: RouteProp<StackParamList, 'Chat'>;
}

const BackIcon = (props?: Partial<ImageProps>) => (
  <Icon {...props} name="arrow-ios-back-outline" />
);

const Chat: React.FC<Props> = ({
  navigation,
  route: {params},
}): React.ReactElement => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [faded, setFaded] = useState<boolean>(false);

  const listRef = useRef<List>(null);

  const theme = useTheme();
  const {join, leave, messages, offer, toArchive} =
    useContext<Context>(SocketContext);

  const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const messagesList =
    params.param === 'Archive' ? (params.item as Archive).messages : messages;

  const startAnimation = () => {
    fadeAnim.setValue(faded ? 1 : 0);
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: faded ? 0 : 1,
      duration: 2000,
    }).start(() => startAnimation());
    setFaded(!faded);
  };

  useEffect(() => {
    startAnimation();
  }, []);

  useEffect(() => {
    listRef.current?.scrollToEnd({animated: true});
  }, [messagesList]);

  useEffect(() => {
    if (params.param === 'Incoms') {
      join(params.item.id, params.item.email);
      return () => {
        leave(params.item.id);
      };
    }
  }, [params.param]);

  const makeOffer = () => {
    toggleMenu();
    offer(params.item.id);
    navigation.navigate('Video', params.item);
  };

  const sendToArchive = () => {
    toArchive(params.item.id);
    navigation.navigate('Archive');
  };

  const renderMenuAction = () => (
    <TopNavigationAction
      onPress={toggleMenu}
      icon={props => <Icon {...props} animation="shake" name="more-vertical" />}
    />
  );

  const liveIcon = (props?: Partial<ImageProps>) => (
    <Animated.View
      {...props}
      style={{
        opacity: fadeAnim,
        width: 18,
        height: 18,
        marginHorizontal: 9,
        backgroundColor: theme['color-danger-transparent-500'],
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 10,
          backgroundColor: theme['color-danger-500'],
        }}
      />
    </Animated.View>
  );

  const archiveIcon = (props?: Partial<ImageProps>) => (
    <Icon {...props} animation="shake" name="archive-outline" />
  );

  const renderRightActions = () =>
    params.param === 'Incoms' ? (
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}>
        <MenuItem onPress={makeOffer} accessoryLeft={liveIcon} title="Live" />
        <MenuItem
          onPress={sendToArchive}
          accessoryLeft={archiveIcon}
          title="В архив"
        />
      </OverflowMenu>
    ) : (
      <Fragment />
    );

  const goBack = () =>
    params.fromNotification
      ? navigation.navigate('Home')
      : navigation.canGoBack() && navigation.goBack();

  const renderLeftActions = () => (
    <TopNavigationAction icon={BackIcon} onPress={goBack} />
  );

  const RenderMessages: React.FC = useCallback(() => {
    if (messagesList)
      return (
        <>
          <List
            inverted={params.param === 'Incoms'}
            ref={listRef}
            data={messagesList}
            renderItem={({index, item}) => (
              <Message key={index} message={item} email={params.item.email} />
            )}
          />
          {/* <CircleButton /> Implementation required */}
        </>
      );
    else return <Preloader />;
  }, [messagesList, params]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation
        alignment="center"
        accessoryLeft={renderLeftActions}
        accessoryRight={renderRightActions}
        title={params.item.email}
        subtitle={
          params.param === 'Incoms'
            ? params.item.name
            : `В архиве с - ${params.item.time}`
        }
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
        <Layout style={{flex: 1}}>
          <RenderMessages />
          {params.param === 'Incoms' && <InputToolbar id={params.item.id} />}
        </Layout>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Chat;
