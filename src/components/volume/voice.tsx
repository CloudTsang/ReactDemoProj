import React from 'react';
import Icon from '../ui/icon';
import {makeStyles} from '@material-ui/core/styles';

import './index.scss';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    marginTop: '8px',
  },
  sliderClass: {
    color: '#44A2FC',
    minWidth: '210px',
    marginLeft: '6px',
  },
  sliderRailClass: {
    height: '12px',
    color: '#44A2FC'
  },
  sliderMarkClass: {
    height: '12px',
    color: '#CCCCCC'
  }
});

const totalVolumes = 52;
const shortVolumes = 10

function CustomSlider(props: any) {
  // console.log('props.volume', props.volume);
  return (
    <div className={props.col?"voice-sliders col":"voice-sliders"}>
      {!props.col?
      <>{[...Array(props.col?shortVolumes:totalVolumes)].map((e: any, key: number) => <span className={props.volume > key ? "active" : ""} key={key}></span>)}</>
      :<>{[...Array(props.col?shortVolumes:totalVolumes)].map((e: any, key: number) => <span className={props.volume > (key*5) ? "active col" : "col"} key={key}></span>)}</>
      }
    </div>
  )
}

function VoiceSlider(props: any) {
  const classes = useStyles(props);
  const volume = props.volume;
  const col = props.col;

  return (
    <div className={classes.root}>
      {!col?<Icon className="icon-voice" disable />:null}
      <CustomSlider volume={volume * totalVolumes} className={classes.sliderClass} col={col}/>
    </div>
  );
}

export default function (props: any) {
  return (
    <div className={props.col?"volume-container col":"volume-container"}>
      <VoiceSlider volume={props.volume} col={props.col?true:false}/>
    </div>
  )
}