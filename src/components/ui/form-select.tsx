import React from 'react';
import { Select, InputLabel, MenuItem, FormHelperText } from '@material-ui/core';
// import { t } from '../i18n';

export interface FormSelectItems {
  text: string
}

export interface FormSelect {
  items: FormSelectItems[]
  Label: string
  value: any
  warn?:string
  onChange: (evt: any) => any
}

const FormSelect: React.FC<FormSelect> = ({
  Label,
  value,
  onChange,
  items,
  warn
}) => {
  return (
    <>
      <InputLabel>{Label}</InputLabel>     
      <Select
        value={value}
        onChange={onChange}
      >
        {items.map((item: any, key: number) => 
          <MenuItem key={key} value={key}>{item.text}</MenuItem>
        )}
      </Select>
      {
        warn && !items[value]?
        <FormHelperText style={{color:'red'}}>{warn}</FormHelperText>
        :null
      }
      
    </>
  );
}

export default React.memo(FormSelect);