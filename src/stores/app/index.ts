import { UIStore } from './ui';
import { get } from 'lodash';
import { autorun, toJS, observable, action, computed, runInAction } from 'mobx';
import { t } from '@/i18n';
import { LoginStore } from './login';

export class AppStore {
  uiStore!: UIStore;  
  loginStore!: LoginStore
  constructor() {
    this.uiStore = new UIStore(this)
    this.loginStore = new LoginStore(this)
  }


  @observable
  delay: number = 0

  @observable
  time: number = 0

  @observable
  cpuRate: number = 0

  @action
  updateCpuRate(rate: number) {
    this.cpuRate = rate
  }

  updateTime(startTime: number) {
    if (startTime) {
      const preState = Math.abs(Date.now() - startTime)
      this.time = preState
    }
  }
  
  resetTime() {
    this.time = 0
  }
}

export { UIStore } from './ui';
export { LoginStore} from './login'