
import { MobXProviderContext } from 'mobx-react';
import { useContext } from 'react';
import { AppStore,UIStore,LoginStore } from '@/stores/app';


export type appContext = Record<string, AppStore>

export const useAppStore = (): AppStore => {
  const context = useContext<appContext>(MobXProviderContext);
  return context.store
}

export const useUIStore = (): UIStore => {
  const context = useContext<appContext>(MobXProviderContext);
  return context.store.uiStore
}

export const useLoginStore = (): LoginStore=>{
  const context = useContext<appContext>(MobXProviderContext);
  return context.store.loginStore;
}