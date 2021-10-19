import {isElectron } from '../utils/platform';
//@ts-ignore
const build_version = isElectron ? appver:'1.0.0';

const zhCN: any = {    
  'error': {
    'not_found': '页面找不到',
    'components': {
      'paramsEmpty': '参数：{reason}不能为空',
    }
  }, 
  'device': {
    'camera': '摄像头',
    'microphone': '麦克风',
    'speaker': '扬声器',
  },
  'nav': {
    'delay': '延迟: ',
    'network': '网络: ',
    'cpu': 'CPU: ',
  },  
  'day':{
    'Monday':'周一',
    'Tuesday':'周二',
    'Wednesday':'周三',
    'Thursday':'周四',
    'Friday':'周五',
    'Saturday':'周六',
    'Sunday':'周日',
  },
  'build_version': `软件版本: ${build_version}`,
}

export default zhCN;