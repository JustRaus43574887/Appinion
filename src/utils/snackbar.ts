import Snackbar from 'react-native-snackbar';

type TSnack = {
  text: string;
  type: 'success' | 'error';
};

export const show = ({text, type = 'success'}: TSnack): void =>
  Snackbar.show({
    text,
    duration: Snackbar.LENGTH_SHORT,
    backgroundColor: type === 'success' ? '#38E59C' : '#F44336',
    fontFamily: 'Montserrat-Regular',
  });
