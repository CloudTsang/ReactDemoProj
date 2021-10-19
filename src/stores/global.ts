import {Subject} from 'rxjs';
import GlobalStorage from '../utils/custom-storage';

export type GlobalState = {
  loading: boolean
  loadingTips?:string
  loadingResource: boolean
  loadingProgress?: any
  lock: boolean
  toast: {
    type: string
    message: string
  }
  dialog: {
    type: string
    message: string
    confirmText?: string
    cancelText?: string
    callBack?: (v:boolean)=>void
  }  
  notice: {
    text: string
    reason: string
  },  
  active: string,
  language: string,
  newMessageCount: number,
  enableMediaBoard: boolean,
}

export class Root {
  private subject: Subject<GlobalState> | null;
  public state: GlobalState;
  public readonly defaultState: GlobalState = {
    loading: false,
    loadingResource: false,
    toast: {
      type: '',
      message: '',
    },
    dialog: {
      type: '',
      message: '',
      confirmText: 'confirm',
      cancelText: 'cancel'
    },   
    notice: {
      reason: '',
      text: '',
    },
    lock: false,
    active: 'chatroom',
    language: navigator.language,
    newMessageCount: 0,
    enableMediaBoard: false,
  }

  constructor() {
    this.subject = null;
    this.state = this.defaultState;
  }

  initialize() {
    this.subject = new Subject<GlobalState>();
    this.state = {
      ...this.defaultState,
    }
    this.subject.next(this.state);
  }

  subscribe(updateState: any) {
    this.initialize();
    this.subject && this.subject.subscribe(updateState);
  }

  unsubscribe() {
    this.subject && this.subject.unsubscribe();
    this.subject = null;
  }

  commit (state: GlobalState) {
    this.subject && this.subject.next(state);
  }

  updateState(rootState: GlobalState) {
    this.state = {
      ...this.state,
      ...rootState,
    }
    this.commit(this.state);
  }

  showNotice({
    reason,
    text,
  }:{
    reason: string,
    text: string
  }) {
    this.state = {
      ...this.state,
      notice: {
        text,
        reason
      }
    }
    this.commit(this.state);
  }

  removeNotice() {
    this.state = {
      ...this.state,
      notice: {
        text: '',
        reason: ''
      }
    }
    this.commit(this.state);
  }

  showToast({type, message}: {type: string, message: string}) {
    if(message === 'No message available' || message === "undefined"){
      return;
    }
    this.state = {
      ...this.state,
      toast: {
        type, message
      },
    }
    this.commit(this.state);
  }

  showDialog({type, message, callBack}: {type: string, message: string, callBack?:(v:boolean)=>void}) {
    this.state = {
      ...this.state,
      dialog: {
        type,
        message,
        callBack,
      },
    }
    this.commit(this.state);
  }

  removeDialog() {
    this.state = {
      ...this.state,
      dialog: {
        type: '',
        message: ''
      },
    }
    this.commit(this.state);
  }

  showLoading (tips?:string) {
    this.state = {
      ...this.state,
      loading: true,
      loadingTips:tips
    }
    this.commit(this.state);
  }

  showLoadingResource(progress?:any){
    this.state = {
      ...this.state,
      loadingResource: true,
      loadingProgress: progress,

    }
    this.commit(this.state);
  }

  stopLoading () {
    this.state = {
      ...this.state,
      loading: false,
      loadingTips:undefined,
      loadingResource: false,
      loadingProgress: undefined,
    }
    this.commit(this.state);
  }

  getLanguage(): string {
    return GlobalStorage.read('demo_language')
  }

  setLanguage(language: string) {
    this.state = {
      ...this.state,
      language,
    }
    this.commit(this.state);
    GlobalStorage.save('demo_language', this.state.language);
    window.location.reload();
  }

  lock() {
    this.state = {
      ...this.state,
      lock: true
    }
    this.commit(this.state)
  }

  unlock() {
    this.state = {
      ...this.state,
      lock: false
    }
    this.commit(this.state)
  }
}

export const globalStore = new Root();

// @ts-ignore
window.globalStore = globalStore;