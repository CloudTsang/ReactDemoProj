import React, { useState, useEffect, useRef } from 'react';
import { globalStore } from "../stores/global";
import { historyStore } from './../stores/history';
import { getIntlError, setIntlError } from "./intl-error-helper";
import CryptoJS from "crypto-js";
import {Buffer} from 'buffer'
import moment from "moment";
import { isElectron } from '../utils/platform';
import JSZip from 'jszip';
import { LogManager } from "./logs";
import { DemoFetch,RestFetch } from "../utils/fetch";
import fetchProgress from 'fetch-progress'

//@ts-ignore
export const isRemote:boolean =isElectron? netRemote : false;

export const fetchJson = async ({url, method, data, token, isJSON}:{url?: string, method: string, data?: any, token?: string, isJSON?:boolean}) => {    
    const opts: any = {
      method,      
      headers: {  
        'Content-Type': isJSON?"application/json":'application/x-www-form-urlencoded',       
      },      
    }    
    if (token) {
      opts.headers['Authorization'] = 'token '+token;
    }
    
    if (data) {
      opts.body = data;
    }      
    let resp = undefined;
    resp = await DemoFetch(`${url}`, opts);           
    return resp;    
  }

  export interface RestResponse{
    data: any
    code: number
    headers: Headers
  }
  export const RestFetchJson = async ({url, method, data, token}:{url?: string, method: string, data?: any, token?: string}) => {    
    const opts: any = {
      method,
      headers: {  
        'Content-Type': 'application/x-www-form-urlencoded',       
      },      
    }    
    if (token) {
      opts.headers['Authorization'] = 'token '+token;
    }
    
    if (data) {
      opts.body = data;
    }      
     
    let resp = await RestFetch(`${url}`, opts);
    let jsonData=await resp.json();
    let r:RestResponse={data:jsonData,code:resp.status,headers:resp.headers};
    return r;
  }


const errHandler = (code: number, msg:string)=>{  
    const error = getIntlError(`${code}`)
    const isErrorCode = `${error}` === `${code}`
    globalStore.showToast({
      type: 'apiError',
      message: isErrorCode ? `${msg}` : error
    })

    throw {api_error: error, isErrorCode}  
}


export class DemoApi{    
    createFolder(u:string){           
      //@ts-ignore
      let a:string[] = u.split('/');
      if(a[a.length-1].includes('.')){
        a.pop();
      }       
      let tmp = a.join("/");
      if(tmp.length>0){
        //@ts-ignore
        if(!fs.existsSync(tmp)){
          //@ts-ignore
          fs.mkdirSync(tmp,  { recursive: true });
        }
      }
      return tmp;
    }

    async readJsonFile(u:string){
      try{
        //@ts-ignore
        let s = fs.readFileSync(u).toString();    
        let d = JSON.parse(s);
        return d;
      }catch(err){
        console.log(err)
        return null;
      }            
    }


  async myUnzip(u:string, savePath?:string, cb?:()=>void){     
      if(!savePath){
        savePath = '.';
      }
      try{
        LogManager.getIns().log('解压文件',  u, true);
        //@ts-ignore
        let data = fs.readFileSync(u);        
        if(data){
          let z = new JSZip();          
          let zip = await z.loadAsync(data)          
          console.log(zip.files);                                             
          let keys = Object.keys(zip.files)
          for(let ki=0;ki<keys.length; ki++){
            let filename = keys[ki];
            let obj = zip.files[filename];             
            if(obj.dir == false){
              //@ts-ignore
              if(fs.existsSync(savePath+'/'+filename) && filename.indexOf('.json')<0){                 
                // console.log(filename, "已被保存");                 
                continue;
              }
              let f=zip.file(filename);   
              if(!f){
                continue;
              }           
              //@ts-ignore
              let a:string[] = filename.split('/');
              // if(a[a.length-1].includes('.')){
              //   a.pop();
              // }  
              a.pop();              
              let tmp = a.join("/");
              tmp = savePath + '/' + tmp;                
              if(tmp.length>0){
                //@ts-ignore
                if(!fs.existsSync(tmp)){
                  //@ts-ignore
                  fs.mkdirSync(tmp,  { recursive: true });
                }
              }              
              //@ts-ignore             
              let content = await f.async('nodebuffer');
              try{
                //@ts-ignore
                fs.writeFileSync(savePath+'/'+filename, content);
                // console.log(filename, "解压保存完毕");                                               
              }catch(err){
                console.log(filename, "解压保存失败：", err);                                                 
              }                            
            } else{
              //文件夹            
            }
          }                    
        }
      }catch(err){
        LogManager.getIns().error('解压文件失败', u, true);
        throw err
      }
      
    }
  
    async downloadResource(u:string, u1:string, cb?:((u2:string)=>void), cbf?:(()=>void)){    
      LogManager.getIns().log('开始下载',  u, true);      
        fetch(u)     
           
        .then(fetchProgress({
          onProgress(progress:any) {
            // console.log('fetchProgress : ', { progress });    
            let total = Math.floor(progress.total/1024/1024);
            let transferred= Math.floor(progress.transferred/1024/1024);
            let speed = Math.floor(progress.speed/1024);
            globalStore.showLoadingResource({
              total:total,
              transferred: transferred,
              speed: speed,
            });
          },
          onError(error:any){
            LogManager.getIns().error('下载资源失败', error, true);
            if(cbf){
              cbf();
            }
          }
        }))
        .then((result)=>{
          if(!result.ok){
            throw new Error(result.statusText)
          }
          return result;
        })
        .then(result => result.blob()
        .then(blob=>{               
          if(isElectron){               
            this.createFolder(u1);
            var fileReader = new FileReader();
            fileReader.onload = function() {
              //@ts-ignore                   
              fs.writeFileSync(u1, Buffer.from(new Uint8Array(this.result)));
              if(cb){
                cb(u1);
              }              
            };
            fileReader.readAsArrayBuffer(blob);              
          }else{
            console.log('not electron')
          }       
        })).catch((err)=>{
          LogManager.getIns().error('下载资源失败', err, true);
          if(cbf){
            cbf();
          }
        })               
    }
    
    async downloadResources(u:string[], u1:string[], cb?:(()=>void)){   
      LogManager.getIns().log('开始下载',  u, true);  
      let num = u.length;
      let finish:string[] = []; 
      for(let i=0;i<u.length;i++){
        try{
          let result = await fetch(u[i])
          let blob = await result.blob();                           
          if(isElectron){               
            this.createFolder(u1[i]);                                         
            var fileReader = new FileReader();
            fileReader.onload = function() {
              //@ts-ignore                   
              fs.writeFileSync(u1[i], Buffer.from(new Uint8Array(this.result)));              
              finish.push(u[i])
              console.log(u[i],'下载保存完毕')
              if(finish.length == num){
                console.log('全资源下载保存完毕')
                if(cb){
                  cb();
                }                
              }                    
            };
            fileReader.readAsArrayBuffer(blob);       
          }else{
            console.log('not electron')
          }          
        }catch(err){
          // console.log(u[i], '下载失败：', err);
          LogManager.getIns().error('下载资源失败', u[i], true);
          finish.push(u[i])
          if(finish.length == num && cb){
            console.log('全资源下载保存完毕')
            cb();
          }      
        }                           
      }
      console.log('全资源下载保存完毕')
    }


    async writeFile(u:string, content:string|Buffer, cb?:((v:boolean)=>void)){
      try{
        this.createFolder(u)
        //@ts-ignore
        fs.writeFileSync(u, content);
        if(cb){
          cb(true)
        }
      }catch(err){
        LogManager.getIns().log('保存文件失败',err, false)
        if(cb){
          cb(false);
        }
      }      
    }    
    
    cryptPassword(word:string , code:string):any{               
        let m = CryptoJS.MD5(word).toString();      
        let key = m.substring(0,8);        
        key = CryptoJS.enc.Utf8.parse(key);
        let word_code = word + ',' + code;                    
        let out = CryptoJS.DES.encrypt(word_code, key, {format: CryptoJS.format.Hex, mode: CryptoJS.mode.ECB, padding:CryptoJS.pad.Pkcs7}).toString(); 
        return out;
    }   
    
    cryptMobile(mobile:string, code:string):any{
        let key = code;
        key = CryptoJS.enc.Utf8.parse(key);
        let word_code = code + mobile;      
        let out = CryptoJS.DES.encrypt(word_code, key, {format: CryptoJS.format.Hex, mode: CryptoJS.mode.ECB, padding:CryptoJS.pad.Pkcs7}).toString(); 
        return out;
    }
} 

export const demoApi = new DemoApi();

