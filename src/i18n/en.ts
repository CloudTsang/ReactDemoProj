import {isElectron } from '../utils/platform';

//@ts-ignore
const build_version = isElectron ? appver:'1.0.0';

const en = { 
  'error': {
    'not_found': 'Page Not Found',
    'components': {
      'paramsEmpty': 'params：{reason} can`t be empty',
    }
  },  
  'device': {
    'camera': 'Camera',
    'microphone': 'Microphone',
    'speaker': 'Speaker',    
  },
  'nav': {
    'delay': 'Delay: ',
    'network': 'Network: ',
    'cpu': 'CPU: ',    
  },  
  'day':{
    'Monday':'Mon.',
    'Tuesday':'Tue.',
    'Wednesday':'Wed.',
    'Thursday':'Thu.',
    'Friday':'Fri.',
    'Saturday':'Sat.',
    'Sunday':'Sun.',
  },
  'build_version': `application version: ${build_version}`,
}

export default en;