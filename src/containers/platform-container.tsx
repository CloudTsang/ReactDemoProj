import React, { useEffect, useState } from 'react';
import Icon from '../components/ui/icon';                                                                                                                                                                                                                                                                                      
import _ from 'lodash';
import { useLocation, useHistory } from 'react-router';

export interface IPlatformContext {
  platform: string
  NavBtn: React.FC<any>
  HomeBtn: React.FC<any>
  SettingBtn: React.FC<any>
}

export interface IWindow {
  ownerName: string
  name: string
  windowId: any
  image: string
}

const PlatformContext: React.Context<IPlatformContext> = React.createContext({} as IPlatformContext);

export const usePlatform = () => React.useContext(PlatformContext);

export const PlatformContainer: React.FC<React.ComponentProps<any>> = ({ children }: React.ComponentProps<any>) => {

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [curSize, setCursize] = useState<number>(-1);
  const [prevSize, setPrevSize] = useState<number>(-1);

  const platform = 'electron'
  const location = useLocation();
  const history = useHistory();

  // @ts-ignore
  const ipc = window.ipc;

  useEffect(() => {
    if (!ipc) return;
    if(location.pathname==='/'){
      console.log('登录页面');
      ipc.send('resize-window', {width: 700, height: 500, page:'home'});
    }        
    else {
      ipc.send('resize-window', {width: 700, height: 500, page:location.pathname});
    }
  }, [location, ipc]);

  useEffect(() => {    
    window.addEventListener('resize', (evt: any) => {      
      setCursize(window.innerWidth);      
    });   
    return () => {
      window.removeEventListener('resize', () => {});      
    }
  }, []);

  useEffect(()=>{
    console.log("window resize : ",  curSize, prevSize);      
    if(prevSize == -1){
      setPrevSize(curSize);
      setIsFullScreen(true);
    }else{
      if(curSize > prevSize){
        setPrevSize(curSize);
        setIsFullScreen(true);
      }else{
        setPrevSize(curSize);
        setIsFullScreen(false);
      }
    }
  }, [curSize])

  const handleClick = (type: string) => {
    if (!ipc) return;    
    switch (type) {
      case 'minimum': {
        ipc.send('minimum');
        return;
      }
      case 'maximum': {                   
        ipc.send('maximum');
        return;
      }
      case 'close': {                
        ipc.send('close');      
        return;
      }     
    }
  }

  const NavBtn: React.FC<any> = () => {
    if (platform === 'electron') {
      return (
        <div className="menu-group">
          <Icon className="icon-minimum" icon onClick={() => {
            handleClick("minimum")
          }} />
          
          <Icon className={isFullScreen?"icon-maximum2":"icon-maximum"}icon onClick={() => {
            handleClick("maximum")
          }} />
          <Icon className={location.pathname.indexOf("replay/record")>=0? "icon-exit nav":"icon-close"} icon onClick={() => {
            if(location.pathname.indexOf("replay/record")>=0){
              handleClick("back")
            }else{
              handleClick("close")
            }            
          }} />
        </div>
      )
    }
    return null
  }

  const HomeBtn: React.FC<any> = ({handleSetting,isShowSetting=false,icon="icon-setting"}: any) => {
    if (platform === 'electron') {
      return (<>
        {/* <Icon className="icon-setting" onClick={handleSetting} /> */}
        {
          isShowSetting?<div></div>:<Icon className={icon} onClick={handleSetting} />
        }
        <div className="icon-container">
          <Icon className="icon-minimum" onClick={() => {
            handleClick("minimum")
          }}/>
          <Icon className="icon-close" onClick={() => {
            handleClick('close')
          }}/>
        </div>
      </>)
    }
    return null
  }

  const SettingBtn: React.FC<any> = () => {
    if (platform === 'electron') {
      return (
        <>
          {/* <Icon className="icon-minimum" onClick={() => {
            handleClick("minimum")
          }}/>
          <Icon className="icon-close" onClick={() => {
            handleClick('close')
          }}/> */}
        </>
      )
    }
    return null;
  }

  const value = {
    platform,
    NavBtn,
    HomeBtn,
    SettingBtn
  }

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  )
}