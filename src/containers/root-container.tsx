import React, { useEffect, useRef } from 'react';
import {historyStore} from '../stores/history';
import { GlobalState, globalStore} from '../stores/global';
import {ErrorState, errorStore} from '../pages/error-page/state';
import { useHistory, useLocation } from 'react-router-dom';
import { resolvePeerMessage, jsonParse } from '../utils/helper';
import GlobalStorage from '../utils/custom-storage';
import { t } from '../i18n';
import { LogManager } from '@/services/logs';
import { SocketState, socketStore } from '@/stores/socket';
import { UserState, userStore } from '@/stores/user';

export type IRootProvider = {
  globalState: GlobalState
  errorState: ErrorState
  socketState:SocketState
  userState:UserState
  historyState: any
}

export interface IObserver<T> {
  subscribe: (setState: (state: T) => void) => void
  unsubscribe: () => void
  defaultState: T
}

function useObserver<T>(store: IObserver<T>) {
  const [state, setState] = React.useState<T>(store.defaultState);
  React.useEffect(() => {
    store.subscribe((state: any) => {
      setState(state);
    });
    return () => {
      store.unsubscribe();
    }
  }, []);

  return state;
}


export const RootContext = React.createContext({} as IRootProvider);

export const useStore = () => {
  const context = React.useContext(RootContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a RootProvider');
  }
  return context;
}

export const useGlobalState = () => {
  return useStore().globalState;
}

export const useErrorState = () => {
  return useStore().errorState;
}

export const useUserState = ()=>{
  return useStore().userState;
}

export const useSocketState = ()=>{
  return useStore().socketState
}

export const RootProvider: React.FC<any> = ({children}) => {
  const globalState = useObserver<GlobalState>(globalStore);
  const errorState = useObserver<ErrorState>(errorStore);
  const historyState = useObserver<any>(historyStore);  
  const userState = useObserver<UserState>(userStore);
  const socketState = useObserver<SocketState>(socketStore);
  const history = useHistory();
  const location = useLocation();
  
  const ref = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      ref.current = true;
    }
  }, []);

  const value = {
    globalState, 
    errorState,
    historyState,
    userState,
    socketState,
  }

  useEffect(() => {
    historyStore.setHistory(history)
  }, [])



  useEffect(() => {
    if (location.pathname === '/') {
      return;
    }       
    GlobalStorage.setLanguage(value.globalState.language);
    // TODO: Please remove it before release in production
    // 备注：请在正式发布时删除操作的window属性
    //@ts-ignore
    window.errorState = errorState;
    //@ts-ignore
    window.globalState = globalState;
  }, [value, location]);
  return (
    <RootContext.Provider value={value}>
      {children}
    </RootContext.Provider>
  )
}