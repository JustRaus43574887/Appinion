import React from 'react';

import {Text} from '@ui-kitten/components';
import Logo from '../../../images/Logo';

const Title: React.FC = (): React.ReactElement => {
  return (
    <>
      <Logo />
      <Text category="h5" style={{marginTop: 38}}>
        Войти в аккаунт
      </Text>
    </>
  );
};

export default Title;
