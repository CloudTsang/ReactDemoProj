import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useGlobalState } from '../containers/root-container';
import { Typography } from '@material-ui/core';
import { t } from '@/i18n';

const useStyles = makeStyles(theme => ({
  progress: {
    margin: theme.spacing(2),
    color: '#44A2FC'
  },
  container: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#ffffff',
    opacity: 0.8,
    zIndex: 99999
  }
}));

export const Loading: React.FC<{}> = () => {
  const state = useGlobalState();
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CircularProgress className={classes.progress} />
      {
          state.loadingTips?
         <Typography variant="h5">{state.loadingTips}</Typography>:null
      }
    </div>
  );
}

export const LoadingRes: React.FC<{}> = () => {
  const state = useGlobalState();
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CircularProgress className={classes.progress} />
      <Typography variant="h5">{t('toast.loading_res')}</Typography>
      {
        state.loadingProgress?
        <Typography variant="h5">{`(${state.loadingProgress.transferred}mb/${state.loadingProgress.total}mb)`}</Typography>
        :null
      }
       {
        state.loadingProgress && state.loadingProgress.speed < 100?
        <Typography variant="h5">网络连接速度慢，请检查网络。</Typography>
        :null
      }
    </div>
  );
}

export default function LoadContainer () {

  const state = useGlobalState();

  const loading = state.loading;
  const loadingRes = state.loadingResource

  return (
    <>
    {loading ? <Loading /> : null}
    {loadingRes? <LoadingRes/>: null }
    </>  
    
    
  )
}