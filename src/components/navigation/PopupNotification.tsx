import {Card, Text, StyleService, useStyleSheet} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import {ContentOptionsBase} from 'react-native-push-notification-popup';

const PopupNotification: React.FC<ContentOptionsBase> = props => {
  const styles = useStyleSheet(Styles);

  const RenderHeader: React.FC = () => (
    <View style={styles.header}>
      <Text category="c2" status="info">
        {props.appTitle}
      </Text>
      <Text category="c1" status="info">
        {props.timeText}
      </Text>
    </View>
  );

  return (
    <Card style={styles.card} header={() => <RenderHeader />}>
      <View>
        <Text category="c2">{props.title}</Text>
        <Text category="c1" style={styles.body}>
          {props.body}
        </Text>
      </View>
    </Card>
  );
};

const Styles = StyleService.create({
  card: {
    borderRadius: 25,
    borderColor: 'color-warning-500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 25,
  },
  body: {
    marginTop: 1,
  },
});

export default PopupNotification;
