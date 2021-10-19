import {Subject} from 'rxjs';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { LogManager } from '@/services/logs';
import moment from 'moment';

export type SocketState = {
    socket:W3CWebSocket|null
    onopen:()=>void
    onmessage:(data:any)=>void
    onerror:(err:any)=>void
    onclose:()=>void
    pings:any
}

export class ScoketStore{
    private subject: Subject<SocketState> | null;
    public state: SocketState;    

    constructor() {
        this.subject = null;
        this.state = this.defaultState;
    }

    public readonly defaultState = {
        socket:null,
        onopen:()=>{},
        onmessage:(data:any)=>{},
        onerror:(err:any)=>{},
        onclose:()=>{},
        pings:null,
    }

    initialize() {
        if(this.subject==null){
            this.subject = new Subject<SocketState>();
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
       // console.log("subscribe :", this.subject);
      }
    
    unsubscribe() {
        this.subject && this.subject.unsubscribe();
        this.subject = null;
    }   

    reset(){
        this.state =  {
            socket:null,
            onopen:()=>{},
            onmessage:(data:any)=>{},
            onerror:(err:any)=>{},
            onclose:()=>{},
            pings:null,
        }
        this.commit(this.state)
    }
    commit (state: SocketState) {
        this.subject && this.subject.next(state);
    }

    connect(url:string, onopen:()=>void,
                        onmessage:(data:any)=>void,
                        onerror:(err:any)=>void,
                        onclose:()=>void,
                        reconnectIfClosed:boolean){
        console.log('socket url : ', url);
        let s = new W3CWebSocket(url);     
        
        const pings = setInterval(() => {
            this.send('{"Ping":{}}')
        }, 3000);

        this.state = {
            ...this.state,
            socket:s,
            onopen,
            onmessage,
            onerror,
            onclose,
            pings,
        }           
        this.commit(this.state);           
        
        s.onopen=()=>{
            LogManager.getIns().log("Socket连接成功", moment().format("YYYY-MM-DD h:mm:ss"), true);            
            onopen();
        };
        s.onmessage = (data:any)=>{
            if(!data.data.includes("ping")
            && !data.data.includes("event-all") 
            && !data.data.includes("event-system")){
                LogManager.getIns().info("Socket连接信息", data, false);
            }              
            onmessage(data);
        };
        s.onerror=(err:any)=>{      
            LogManager.getIns().error("Socket连接出错", moment().format("YYYY-MM-DD h:mm:ss"), true);
            onerror(err);
        };
        s.onclose=()=>{
            LogManager.getIns().warn("Socket连接关闭", moment().format("YYYY-MM-DD h:mm:ss"), true);
            onclose();
            if(reconnectIfClosed){
                this.disconnect();
                this.connect(url,onopen,onmessage,onerror,onclose,reconnectIfClosed)
            }
        }               
    }

    send(content:string){
        if(this.checkIsConnected()){
            try{
                this.state.socket && this.state.socket.send(content);                
            }catch(err){
                throw err
            }
        }        
    }

    disconnect(){
        if(this.checkIsConnected()){            
            let s = this.state.socket as W3CWebSocket;
            s.onclose = ()=>{};
            s.onopen = ()=>{};
            s.onerror = ()=>{};
            s.onmessage = ()=>{};
            s.close()
        }
        if(this.state.pings){
            clearInterval(this.state.pings);
        }
        this.reset();
    }

    checkIsConnected(){
        return this.state.socket!=null && this.state.socket.readyState == W3CWebSocket.OPEN
    }
}
export const socketStore = new ScoketStore();