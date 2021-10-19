import {Subject} from 'rxjs';
import { LogManager } from '@/services/logs';

export type UserState = {
    name:string
    isLogin:boolean
}

export class UserStore{
    private subject: Subject<UserState> | null;
    public state: UserState;    

    constructor() {
        this.subject = null;
        this.state = {
            ...this.defaultState
        }
    }

    public readonly defaultState = {
        name:'',
        isLogin:false
    }

    initialize() {
        if(this.subject==null){
            this.subject = new Subject<UserState>();
            this.state = {
                ...this.defaultState,
            }
            this.subject.next(this.state);
        } else{
         //  console.log('subject initialzed')
        }        
    }

    subscribe(updateState: any) {
        this.initialize();
        this.subject && this.subject.subscribe(updateState);
      }
    
    unsubscribe() {
        this.subject && this.subject.unsubscribe();
        this.subject = null;
    }   
    commit (state: UserState) {
        console.log("this.commit : ", this.state);
        this.subject && this.subject.next(state);
    }
   

    login(v:string){
        this.state = {
            ...this.state,
            name:v,
            isLogin:true,
        }
        this.commit(this.state);
    }

    logout(){
        this.state = {
            ...this.state,
            name:'',
            isLogin:false,
        }
        this.commit(this.state);
    }
}

export const userStore = new UserStore();