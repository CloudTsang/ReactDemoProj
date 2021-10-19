import React from 'react';
import { Route } from 'react-router-dom';
import CustomBrowserRouter from '../containers/custom-browser-router';
import ThemeContainer from '../containers/theme-container';
// import Home from './home';
import {HomePage as Home} from './home'
import Loading from '../components/loading';
import Toast from '../components/toast';
import '../icons.scss';
import { PlatformContainer } from '../containers/platform-container';
import { RootProvider } from '../containers/root-container';
import { PageNotFound } from './404';
import RoomDialog from '../components/dialog';
import { ConfigPage } from './config';
import {Provider} from 'mobx-react';
import { AppStore } from '@/stores/app';

const defaultStore = new AppStore()
//@ts-ignore
window.store = defaultStore

export default function () {
  return (
    <Provider store={defaultStore}>
    <ThemeContainer>
      <CustomBrowserRouter>
        <PlatformContainer>
        <RootProvider>
          <Loading />
          <Toast />
          <RoomDialog />          
          <Route path="/config">
            <ConfigPage />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>          
          <Route exact path="/404">
            <PageNotFound />
          </Route>         
        </RootProvider>
        </PlatformContainer>
      </CustomBrowserRouter>    
    </ThemeContainer>
    </Provider>
  )
}
// export default (process.env.NODE_ENV === 'development' ? hot(module)(app) : app);