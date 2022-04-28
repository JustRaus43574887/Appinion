import {Icon} from '@ui-kitten/components';
import React from 'react';
import {ImageProps} from 'react-native';

type Props = Partial<ImageProps>;

export const ProfileIcon = (props?: Props) => (
  <Icon {...props} name="person-outline" />
);

export const ArchiveIcon = (props?: Props) => (
  <Icon {...props} name="archive-outline" />
);

export const TrashIcon = (props?: Props) => (
  <Icon {...props} name="trash-2-outline" />
);
