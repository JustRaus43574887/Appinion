import React from 'react';
import {StyleSheet} from 'react-native';

import {Avatar, Icon, Layout, Text} from '@ui-kitten/components';

import Dispatcher from '../../../../components/images/dispatcher.png';
import {Live} from '../../../../apollo/graphql/queries/live';
import Button from '../../../uioverrides/Button';

import {launchImageLibrary} from 'react-native-image-picker';
import {ReactNativeFile} from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import {useMutation} from '@apollo/client';
import UPLOAD_MUTATION, {
  UploadAvatar,
} from '../../../../apollo/graphql/mutations/uploadAvatar';
import {show} from '../../../../utils/snackbar';
import {socketEndpoint} from '../../../../utils/constants';
import {useState} from 'react';

function generateRNFile(uri?: string, name?: string) {
  return uri
    ? new ReactNativeFile({
        uri,
        type: mime.lookup(uri) || 'image',
        name,
      })
    : null;
}

type Props = {
  data: Live | null;
};

const User: React.FC<Props> = ({data}) => {
  const [avatar, setAvatar] = useState<string | undefined>(
    data?.live?.avatar ? socketEndpoint + data?.live?.avatar?.path : undefined,
  );

  const [upload] = useMutation<UploadAvatar>(UPLOAD_MUTATION, {
    onCompleted: data => {
      if (data.uploadAvatar) {
        show({text: 'Аватар обновлен!', type: 'success'});
      } else show({text: 'Ошибка загрузки аватара!', type: 'error'});
    },
    onError: error => {
      show({text: error.message, type: 'error'});
    },
  });

  const handleChoosePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response && response.assets && response.assets[0]) {
        const file = generateRNFile(
          response.assets[0].uri,
          response.assets[0].fileName,
        );
        setAvatar(file?.uri);
        upload({variables: {avatar: file}});
      }
    });
  };

  return (
    <Layout style={styles.user}>
      <Layout style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar
          source={avatar ? {uri: avatar} : Dispatcher}
          style={{marginRight: 13}}
          size="large"
        />
        <Layout>
          <Text category="s1">{data?.live?.name}</Text>
          <Text category="c1">{data?.live?.position}</Text>
        </Layout>
      </Layout>

      <Button
        onPress={handleChoosePhoto}
        appearance="ghost"
        accessoryLeft={props => <Icon {...props} name="camera-outline" />}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },
  image: {
    borderRadius: 50,
    width: 50,
    height: 50,
    marginRight: 15,
    borderWidth: 1,
  },
});

export default User;
