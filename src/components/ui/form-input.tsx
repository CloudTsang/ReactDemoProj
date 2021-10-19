import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { Theme, Typography, InputLabel, Input } from '@material-ui/core';

const useStyles = makeStyles ((theme: Theme) => ({
  formInput: {
    marginTop:'24px',
    '&:after': {
      borderBottom: '1px solid #44a2fc'
    }
  },
  required: {
    fontSize: '12px',
    color: '#ff0000',
    lineHeight: '17px',
    position: 'absolute',
    top: '48px'
  }
}));

// const ALPHABETICAL = /^[a-zA-Z0-9]*/

export default function (props: any) {
  const classes = useStyles();

  const onChange = (evt: any) => {
    const val = evt.target.value;//.match(ALPHABETICAL)[0];
    props.onChange(val ? val : '');
  }
  return (
    <>
      <InputLabel style={{fontSize:'20px'}}>{props.Label}</InputLabel>
      <Input className={classes.formInput} value={props.value} type={props.type}
        onChange={onChange}  />
       
      {props.requiredText ? <Typography className={classes.required}>{props.requiredText}</Typography> : null}
    </>
  );
}