import React, {createContext} from 'react';
import {TabsParamList} from '../utils/navigation.types';

import io from 'socket.io-client';
import {socketEndpoint} from '../utils/constants';
import {useState} from 'react';
import {useEffect} from 'react';
import {useApolloClient} from '@apollo/client';
import LIVE_QUERY, {Live} from '../apollo/graphql/queries/live';
import {show} from '../utils/snackbar';
import {mediaDevices, MediaStream} from 'react-native-webrtc';
import Peer from 'react-native-peerjs';
import {peerConfig} from '../utils/constants';

interface ListItem {
  id: string;
  name: string;
  email: string;
  time: string;
  seen: boolean;
}

export type Message = {
  type: 'join' | 'live-start' | 'live-end' | 'default' | 'leave';
  from?: 'user' | 'manager';
  text?: string;
  time?: string;
};

export type Incom = ListItem;
export interface Archive extends ListItem {
  messages: Message[] | null;
}
export type Chat = {
  item: Incom | Archive;
  param: keyof TabsParamList;
};

const socket = io(socketEndpoint);
const peer = new Peer(undefined, peerConfig);

export type Context = {
  incoms: Incom[];
  archives: Archive[];
  messages: Message[] | null;
  stream: MediaStream | boolean;
  getIncoms: () => void;
  join: (id: string, email: string) => void;
  leave: (id: string) => void;
  sendMessage: (message: Message, id: string) => void;
  toArchive: (id: string) => void;
  getArchives: () => void;
  deleteArchive: (archive: Archive) => void;
  offer: (id: string) => void;
  endCall: (id: string) => void;
  getMessages: (id: string) => void;
};

const SocketContext = createContext<Context>({
  incoms: [],
  archives: [],
  messages: [],
  stream: false,
  getIncoms: () => {},
  join: () => {},
  leave: () => {},
  sendMessage: () => {},
  toArchive: () => {},
  getArchives: () => {},
  deleteArchive: () => {},
  offer: () => {},
  endCall: () => {},
  getMessages: () => {},
});

type Props = {
  message: {text: string | null; iterator: number | undefined} | null;
  setCurrentChatEmail: React.Dispatch<React.SetStateAction<string>>;
};

export const SocketContextProvider: React.FC<Props> = ({
  children,
  message,
  setCurrentChatEmail,
}) => {
  const client = useApolloClient();
  const data = client.readQuery<Live>({query: LIVE_QUERY});

  const [incoms, setIncoms] = useState<Incom[]>([]);
  const [archives, setArchives] = useState<Archive[]>([]);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [stream, setStream] = useState<MediaStream | boolean>(false);

  useEffect(() => {
    if (message) {
      console.log(message);
      setIncoms(incoms =>
        incoms.map(incom =>
          incom.email === message.text ? {...incom, seen: false} : incom,
        ),
      );
    }
  }, [message]);

  useEffect(() => {
    getIncoms();
    getArchives();

    socket.emit('manager', data?.live?.host);

    socket.on('users', users => {
      setIncoms(users);
    });

    socket.on('message', message => {
      setMessages(messages => (messages ? [message, ...messages] : [message]));
    });

    socket.on('messages', messages => {
      setMessages(messages.reverse());
    });

    socket.on('archive', () => {
      getIncoms();
      getArchives();
      show({text: 'Успешно!', type: 'success'});
    });

    socket.on('archives', archives => {
      setArchives(archives);
    });

    socket.on('deleteArchive', () => {
      getArchives();
      show({text: 'Успешно!', type: 'success'});
    });

    socket.on('answer', id => {
      console.log(id);
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            facingMode: 'environment',
            mandatory: {minFrameRate: 30, minWidth: 360, minHeight: 630},
            optional: [],
          },
        })
        .then(stream => {
          setStream(stream);
          peer.call(id, stream);
        });
    });
  }, []);

  const getIncoms = () => {
    socket.emit('users', data?.live?.host);
  };

  const getMessages = (id: string) =>
    socket.emit('messages', id, data?.live?.host);

  const clearMessages = () => setMessages(null);

  const join = (id: string, email: string) => {
    socket.emit('join', id, data?.live?.host), getMessages(id);
    setCurrentChatEmail(email);
  };

  const leave = (id: string) => {
    socket.emit('leave', id), clearMessages();
    setCurrentChatEmail('leave');
    setIncoms(incoms =>
      incoms.map(incom => (incom.id === id ? {...incom, seen: true} : incom)),
    );
  };

  const sendMessage = (message: Message, id: string) =>
    socket.emit('message', message, id, data?.live?.host);

  const toArchive = (id: string) =>
    socket.emit('archive', id, data?.live?.host);

  const getArchives = () => socket.emit('archives', data?.live?.host);

  const deleteArchive = (archive: Archive) =>
    socket.emit('deleteArchive', archive, data?.live?.host);

  const offer = (id: string) => socket.emit('offer', id, data?.live?.host);

  const endCall = (id: string) => {
    socket.emit('endcall', id, data?.live?.host);
    if (typeof stream !== 'boolean') {
      stream.getTracks().forEach(track => track.stop());
      stream.release();
    }
    setStream(false);
  };

  return (
    <SocketContext.Provider
      value={{
        incoms,
        archives,
        messages,
        stream,
        getIncoms,
        join,
        leave,
        sendMessage,
        toArchive,
        getArchives,
        deleteArchive,
        offer,
        endCall,
        getMessages,
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
