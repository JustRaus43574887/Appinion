import {Text} from '@ui-kitten/components';
import React from 'react';
import {Linking, TextProps, TouchableOpacity} from 'react-native';
import {Live} from '../../apollo/graphql/queries/live';

interface SubtitleProps extends TextProps {
  data: Live | null;
}

const DefaultSubtitle: React.FC<SubtitleProps> = props => {
  const handleRedirect = () =>
    Linking.openURL(props.data?.live?.host || 'https://appinion.digital');

  return (
    <TouchableOpacity onPress={handleRedirect}>
      <Text
        {...props}
        status="primary"
        style={{
          fontSize: (props?.style as any).fontSize,
          textDecorationLine: 'underline',
        }}>
        {props.data?.live?.host.substring(8)}
      </Text>
    </TouchableOpacity>
  );
};

export default DefaultSubtitle;
