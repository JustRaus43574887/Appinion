import {useTheme} from '@ui-kitten/components';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const InterfaceBars: React.FC = (): React.ReactElement<StatusBar> => {
  const theme = useTheme();

  useEffect(() => {
    changeNavigationBarColor(theme['color-basic-100'], true, true);
  }, []);

  return (
    <StatusBar
      backgroundColor={theme['color-basic-100']}
      barStyle="dark-content"
    />
  );
};

export default InterfaceBars;
