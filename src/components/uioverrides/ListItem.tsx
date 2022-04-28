import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import SocketContext, {
  Archive,
  Context,
  Incom,
} from '../../context/SocketContext';
import {StackParamList, TabsParamList} from '../../utils/navigation.types';
import React, {Fragment, useContext, useState} from 'react';
import {
  Layout,
  useStyleSheet,
  ListItem as UiListItem,
  MenuItem,
  OverflowMenu,
  StyleService,
} from '@ui-kitten/components';
import {ImageProps, Vibration, ViewProps} from 'react-native';
import {ArchiveIcon, ProfileIcon, TrashIcon} from '../images/Icons';

const request = 'Запрос на видеоконсультацию -';
const archive = 'В архиве с -';

type Props<T extends keyof TabsParamList> = {
  item: Archive | Incom;
  param: T;
};

const ListItem = <T extends keyof TabsParamList>({item, param}: Props<T>) => {
  const styles = useStyleSheet(Styles);
  const {navigate} = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [visible, setVisible] = useState<boolean>(false);
  const {toArchive, deleteArchive} = useContext<Context>(SocketContext);

  const handleNavigate = () => navigate('Chat', {item, param});

  const overflowClose = () => setVisible(false);
  const handleVisible = () => {
    Vibration.vibrate(100, false);
    setVisible(true);
  };

  const handleToArchive = () => {
    toArchive(item.id);
    setVisible(false);
  };

  const handleDeleteArchive = () => {
    deleteArchive(item as Archive);
    setVisible(false);
  };

  const accessoryRight = (props?: Partial<ImageProps | ViewProps>) =>
    param === 'Archive' ? (
      <ArchiveIcon {...(props as ImageProps)} />
    ) : item.seen ? (
      <Fragment />
    ) : (
      <Layout {...props} style={styles.seen} />
    );

  const description = `${param === 'Incoms' ? request : archive} ${item.time}`;

  const renderItem = () => (
    <UiListItem
      onPress={handleNavigate}
      onLongPress={handleVisible}
      title={item.email}
      description={description}
      accessoryLeft={ProfileIcon}
      accessoryRight={accessoryRight}
    />
  );

  const RenderMenuItem = () =>
    param === 'Incoms' ? (
      <MenuItem
        onPress={handleToArchive}
        title="В архив"
        accessoryLeft={ArchiveIcon}
      />
    ) : (
      <MenuItem
        onPress={handleDeleteArchive}
        title="Удалить"
        accessoryLeft={TrashIcon}
      />
    );

  return (
    <OverflowMenu
      anchor={renderItem}
      visible={visible}
      onBackdropPress={overflowClose}
      placement="bottom end">
      <RenderMenuItem />
    </OverflowMenu>
  );
};

const Styles = StyleService.create({
  seen: {
    width: 10,
    height: 10,
    backgroundColor: 'color-primary-500',
    borderRadius: 50,
    marginRight: 5,
  },
});

export default ListItem;
