import { MiddlewareAPI } from 'redux';
import { useSelector } from 'react-redux';
import { TypeSocket } from 'typesocket';
// eslint-disable-next-line import/no-cycle
import { RootState } from '..';
import { Message } from './models';

import {
  connectedAction,
  disconnectedAction,
  messageAction,
  sendMessageAction,
} from './reducer';

export const socketMiddleware = (url: string, name: string = 'handtracking') => {
  return (store: MiddlewareAPI<any, unknown>) => {
    const socket = new TypeSocket<Message>(url, {
      maxRetries: 0,
      retryOnClose: true,
      retryTime: 2000,
    });
    let subwayBlocked = false
    socket.on('connected', () => store.dispatch(connectedAction()));
    socket.on('disconnected', () => {
      // console.log('DISCONECTED');
      store.dispatch(disconnectedAction());
    });
    socket.on('message', message => {
      // if (message.result === 'enabled') subwayBlocked = true
      // else if (message.result === 'enabled') subwayBlocked = false
      // console.log('subway-blocked', subwayBlocked)
      // if (subwayBlocked === 'disabled') return
      // if (subwayBlocked) {
      //   socket.disconnect();
      // }
      store.dispatch(messageAction(message))
      // }

    });
    socket.connect();

    return (next: (action: unknown) => void) => (action: unknown) => {
      if (sendMessageAction.match(action)) {
        if (action.payload.to === 'connect') {
          subwayBlocked = false
          socket.connect();
          // console.log('CONNECTED', action.payload.message)
          // socket.send(action.payload.message);
        }
        if (action.payload.to === 'disconnect') {
          subwayBlocked = true
          socket.disconnect();
          // console.log('DISCONNECTED', action.payload.message)
        }
      }
      if (sendMessageAction.match(action) && socket.readyState === 1) {
        if (action.payload.to === name) {
          socket.send(action.payload.message);
        }
      }

      return next(action);
    };
  };
};
