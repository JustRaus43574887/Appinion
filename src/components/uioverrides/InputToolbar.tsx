import {Icon, Input, Layout} from '@ui-kitten/components';
import {EvaStatus} from '@ui-kitten/components/devsupport';
import React, {Fragment} from 'react';
import {useContext} from 'react';
import {useState} from 'react';
import {
  ImageProps,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import SocketContext, {Context} from '../../context/SocketContext';

type Props = {
  id: string;
  transparent?: boolean;
};

const InputToolbar: React.FC<Props> = ({id, transparent = false}) => {
  const {sendMessage} = useContext<Context>(SocketContext);
  const [message, setMessage] = useState<string>('');
  const handleChange = (text: string) => setMessage(text);

  const handleSend = () => {
    sendMessage({type: 'default', text: message, from: 'manager'}, id);
    setMessage('');
  };

  const accessoryRight = (props?: Partial<ImageProps>) =>
    message.length ? (
      <TouchableOpacity onPress={handleSend}>
        <Icon {...props} name="paper-plane-outline" />
      </TouchableOpacity>
    ) : (
      <Fragment />
    );

  const layoutStyle: StyleProp<ViewStyle> = transparent
    ? {padding: 10, backgroundColor: 'transparent'}
    : {padding: 10};
  const inputStyle: StyleProp<TextStyle> = transparent
    ? {borderRadius: 50, backgroundColor: 'transparent'}
    : {borderRadius: 50};
  const status: EvaStatus = transparent ? 'control' : 'basic';

  return (
    <Layout style={layoutStyle}>
      <Input
        status={status}
        value={message}
        onChangeText={handleChange}
        style={inputStyle}
        placeholder="Сообщение..."
        accessoryRight={accessoryRight}
      />
    </Layout>
  );
};

export default InputToolbar;
