import {Card, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

type Props = {
  email: string;
};

const LiveStart: React.FC<Props> = ({email}) => {
  return (
    <Card style={styles.card}>
      <Layout level="3" style={styles.cloud}>
        <Text category="s2">Вы предложили видео-трансляцию</Text>
        <Text category="p2" style={{marginTop: 8}}>
          Ожидаем подключения к ней
        </Text>
        <Text category="p2">{email}</Text>
      </Layout>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cloud: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
});

export default LiveStart;
