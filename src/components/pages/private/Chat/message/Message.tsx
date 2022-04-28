import React, {Fragment} from 'react';
import {Message as TMessage} from '../../../../../context/SocketContext';
import Default from './Default';
import LeaveChat from './LeaveChat';
import LiveEnd from './LiveEnd';
import LiveStart from './LiveStart';

type Props = {
  message: TMessage;
  email: string;
};

const Message: React.FC<Props> = ({message, email}) => {
  switch (message.type) {
    case 'default':
      return <Default {...message} />;
    case 'leave':
      return <LeaveChat email={email} />;
    case 'live-start':
      return <LiveStart email={email} />;
    case 'live-end':
      return <LiveEnd />;
    default:
      return <Fragment />;
  }
};

export default Message;
