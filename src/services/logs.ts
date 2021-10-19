import { isElectron } from '../utils/platform';
import moment from "moment";

type mylog = {
    t:number
    l:number
    g:string
    c:string
}

export class LogManager{
    private static ins:LogManager;
    private logArr:mylog[];

    private appid:string;
    private version:string;
    private uid:number;    
    private plat:string;
    private device:string;
    private uuid:string|null; 
    private curIndex:number;

    private autoUpload:boolean = true;
    private isUploading:boolean = false;

    private AUTO_UPLOAD_STEP:number = 20

    constructor(){        
        this.uid = -1;
        this.logArr = [];
        this.appid = this.getAppId();
        this.version = this.getAppVer();
        this.device = this.getDevice();
        this.plat = this.getPlatform();
        this.uuid = localStorage.getItem('uuid')?localStorage.getItem('uuid'):'';
        this.curIndex = 0;
    }    

    public async uploadLog(){
        if(this.curIndex >= this.logArr.length){
            return;
        }
        // console.log("uploadLog isUploading: ", this.isUploading);
        if(this.isUploading){
            return;
        }
        this.isUploading = true;
        let u = 'https://api.cloudsoft.cn/logcat/app';   
        const opts: any = {
            method: "POST",
            headers: {  
              'Content-Type': 'application/json',       
            }
        }   
    
        opts.body = JSON.stringify({
            appid:this.appid,
            version:this.version,
            uid:this.uid,
            device:this.device,
            platform:this.plat,
            key:this.uuid,
            data:this.logArr.slice(this.curIndex)
        })
        //console.log('opts : ',opts);
        // return;
        
        fetch(u, opts)
        .then(response=>response.json())
        .then(json=>{
            this.info('数据上传', json, false);
            this.curIndex = this.logArr.length;
            this.isUploading = false;
        })
        .catch((err)=>{           
        })
        .finally(()=>{
            this.isUploading = false;
        })
    }

    //获取应用名称、版本、设备信息的方法，请根据各自框架提供的api修改

    private getAppId():any{
        //@ts-ignore
        return appid;
    }

    private getAppVer():string{        
        //@ts-ignore
        return appver
    }

    private getDevice():string{
        return 'pc';
    }

    private getPlatform():string{
        try{
            //@ts-ignore
            return 'cpu:'+os.cpus()[0].model+" ram:"+ Math.round(os.totalmem()/1024/1024/1024) + 'GB'
        }catch(err){
            return 'pc';
        }      
    }

    public setUid(uid:number){
        this.uid = uid;
    }

    public reset(){
        this.logArr = [];
        this.curIndex = 0;
    }

    public static getIns(){
        if(!LogManager.ins){            
            LogManager.ins = new LogManager();            
        }
        return LogManager.ins;
    }

    public log(tag:string, message:any, send?:boolean){
        console.log('LogManager:', moment().format('h:mm:ss'), tag, message);
        if(send){
            this.logArr.push(
                {
                    t: Date.now().valueOf(),
                    l: 1,
                    g: tag,
                    c: String(message)
                }
            )   
            if(this.logArr.length - this.curIndex > this.AUTO_UPLOAD_STEP){
                this.uploadLog()
            }
        }               
    }

    public info(tag:string, message:any, send?:boolean){
        console.info('LogManager:', moment().format('h:mm:ss'), tag, message);
        if(send){
            this.logArr.push(
                {
                    t: Date.now().valueOf(),
                    l: 0,
                    g: tag,
                    c: String(message)
                }
            )
            if(this.logArr.length - this.curIndex > this.AUTO_UPLOAD_STEP){
                this.uploadLog()
            }                        
        }
    }

    public warn(tag:string, message:any, send?:boolean){
        console.warn('LogManager:', moment().format('h:mm:ss'), tag, message);
        if(send){
            this.logArr.push(
                {
                    t: Date.now().valueOf(),
                    l: 2,
                    g: tag,
                    c: String(message)
                }
            )  
            if(this.logArr.length - this.curIndex > this.AUTO_UPLOAD_STEP){
                this.uploadLog()
            }          
            
        }
    }

    public error(tag:string, message:any, send?:boolean){
        console.error('LogManager:', moment().format('h:mm:ss'), tag, message);
        if(send){
            this.logArr.push(
                {
                    t: Date.now().valueOf(),
                    l: 3,
                    g: tag,
                    c: String(message)
                }
            )  
            if(this.logArr.length - this.curIndex > this.AUTO_UPLOAD_STEP){
                this.uploadLog()
            }          
            
        }
    }
}