import React, { useState, useEffect, useRef } from 'react';
import { Theme, FormControl, InputLabel, Typography } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { isElectron } from '../utils/platform';
import {useHistory} from 'react-router-dom';
import Autocomplete from 'react-autocomplete';
import { useLoginStore } from '@/hooks';
import CButton from '../components/ui/custom-button';
import { observer, inject } from 'mobx-react';
import {  userStore } from '@/stores/user';
import { useUserState } from '@/containers/root-container';


export type SessionInfo = {
  name:string
  accounts: string[][]
}

// function HomePage() {
export const  HomePage = observer(()=>{
  const history = useHistory();
  const [session, setSessionInfo] = useState<SessionInfo>({name:'', accounts:[]});
  const loginStore = useLoginStore();
  const userState = useUserState();


  const ref = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      ref.current = true;
    }
  }, []);

  useEffect(()=>{
    let name = localStorage.getItem('name');
    let accstr = localStorage.getItem('accounts');
    let accounts:any[] = []    
    if(accounts){
      try{
        accounts = JSON.parse(accstr?accstr:'[]');
      }catch(err){

      }
    }
    setSessionInfo({
      ...session,
      name: name?name:'',
      accounts: accounts,
    });

  }, [])

  useEffect(()=>{
    console.log("loginStore.isLogin : ", loginStore.isLogin);
  }, [loginStore.isLogin])


  const handleLogin=()=>{
    userStore.login(session.name)
    loginStore.login(session.name, '');
    // history.push('/main');
  }

  const handleLogout=()=>{
    userStore.logout();
    loginStore.logout();
  }


  return (
    <div className={`flex-container ${isElectron ? 'draggable' : 'home-cover-web' }`}>
      <div className="position-content">
              {
                !userState.isLogin?
                <>
                <FormControl style={{minWidth:'240px', maxWidth:'240px'}}>
                  <InputLabel>名字</InputLabel>
                  <Autocomplete           
                    inputProps={{style:{
                      border: 'none',
                      width: '100%',
                      borderBottom: '1px solid #44a2fc', 
                      fontSize: '20px',                  
                      lineHeight: '24px',
                      position: 'absolute',
                      top: '48px'
                    }}}
                    items={session.accounts}
                    shouldItemRender={(item, value) => {
                      return  item[0].toLowerCase().indexOf(value.toLowerCase()) > -1
                    }
                    }              
                    getItemValue={(item) => {
                      return item[0]
                    }}
                    renderItem={(item, isHighlighted) =>
                      <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                        {item[0]}
                      </div>
                    }
                    value={session.name}                    
                    onChange={(e) => { 
                      setSessionInfo({
                        ...session,
                        name: e.target.value,         
                      });                               
                    }}
                    onSelect={(val) => {
                      for(let i=0;i<session.accounts.length; i++){
                        if(session.accounts[i][0] === val){
                          setSessionInfo({
                            ...session,
                            name: session.accounts[i][0],                          
                          });
                        }
                      }
                      
                    }}
                  />  
                </FormControl>    
                <CButton name={'登录'} onClick={handleLogin}/>     
                </>
                :
                <>
                <Typography variant='h3'>{`欢迎你！${userState.name}`}</Typography>
                <CButton name={'注销'} onClick={handleLogout}/>     
                </>
              }
              
          </div>
    </div>
  )
})
export default React.memo(HomePage);
// export default HomePage;