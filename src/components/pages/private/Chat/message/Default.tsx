import {Card, Layout, Text, useTheme} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

type Props = {
  text?: string;
  time?: string;
  from?: 'user' | 'manager';
};

const Default: React.FC<Props> = ({text, time, from}) => {
  const theme = useTheme();

  return (
    <Card
      style={{
        ...styles.card,
        justifyContent: from === 'user' ? 'flex-start' : 'flex-end',
      }}>
      <Layout
        style={{
          ...styles.cloud,
          alignItems: from === 'user' ? 'flex-start' : 'flex-end',
          backgroundColor:
            from === 'user'
              ? theme['color-info-200']
              : theme['color-primary-100'],
        }}>
        <Text category="p1">{text}</Text>
        <Text category="c1" status="info">
          {time}
        </Text>
      </Layout>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    flexDirection: 'row',
  },
  cloud: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});

export default Default;
