import React from 'react';
export default function ({data, icon, disable, className, onClick, active, text, onMouseEnter, onMouseLeave, onMouseDown}: any) {
  let iconClass = disable ? '' : (icon ? 'icon-btn' : 'icon');
  iconClass = active ? iconClass + " active" : iconClass;

  const dataName = data ? data : ''
  return (
    <div className={`${iconClass} ${className}`} onClick={onClick} data-name={dataName} 
    onMouseEnter={onMouseEnter?onMouseEnter:undefined}
    onMouseLeave={onMouseLeave?onMouseLeave:undefined}   
    onMouseDown={onMouseDown?onMouseDown:undefined} 
    >
      {text?text:''}
      
    </div>
  )
}