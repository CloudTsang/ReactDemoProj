import { observable, action, computed } from 'mobx';
import { AppStore } from '@/stores/app';

export class LoginStore{
    appStore!: AppStore
    constructor(appStore: AppStore) {
        this.appStore = appStore
    }

    @observable
    account:string = 'default'

    @observable
    password:string = '';

    @observable
    isLogin:boolean = false;

    @action
    setAccount(v:string){
        this.account = v;
    }

    @action
    login(acc:string, pw:string){
        this.account = acc;
        this.password = pw;
        this.isLogin = true;
    }

    @action
    logout(){
        this.account = '';
        this.password = '';
        this.isLogin = false;
    }
}