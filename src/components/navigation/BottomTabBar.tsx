import React from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  BottomNavigationTab,
  Divider,
  Icon,
} from '@ui-kitten/components';
import {ImageProps} from 'react-native';

const IncomsIcon = (props?: Partial<ImageProps>) => (
  <Icon {...props} name="message-circle-outline" />
);
const ArchiveIcon = (props?: Partial<ImageProps>) => (
  <Icon {...props} name="archive-outline" />
);
const ProfileIcon = (props?: Partial<ImageProps>) => (
  <Icon {...props} name="person-outline" />
);

const BottomTabBar: React.FC<BottomTabBarProps> = ({state, navigation}) => (
  <>
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title="Входящие" icon={IncomsIcon} />
      <BottomNavigationTab title="Архив" icon={ArchiveIcon} />
      <BottomNavigationTab title="Профиль" icon={ProfileIcon} />
    </BottomNavigation>
    <Divider />
  </>
);

export default BottomTabBar;
