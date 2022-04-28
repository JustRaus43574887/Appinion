import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {RTCView, mediaDevices, MediaStream} from 'react-native-webrtc';
import {useContext} from 'react';
import SocketContext, {Context} from '../../../../context/SocketContext';

const WebRTCView: React.FC = () => {
  const {stream} = useContext<Context>(SocketContext);

  return (
    <RTCView
      streamURL={typeof stream !== 'boolean' ? stream.toURL() : ''}
      style={{width: '100%', height: '100%'}}
      objectFit="cover"
    />
  );
};

export default WebRTCView;
