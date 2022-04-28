import {Card, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

const LiveEnd: React.FC = () => {
  return (
    <Card style={styles.card}>
      <Layout level="3" style={styles.cloud}>
        <Text category="s2">Трансляция завершена</Text>
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

export default LiveEnd;
