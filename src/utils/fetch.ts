import { globalStore } from "../stores/global";
import { getIntlError } from '../services/intl-error-helper';

const FETCH_TIMEOUT = 60000

// const delay = 100;

export async function Fetch (input: RequestInfo, init?: RequestInit, retryCount: number = 0): Promise<any> {
  return new Promise((resolve, reject) => {
    const onResponse = (response: Response) => {           
      // console.log('@onResponse response = ' + response);   
      // if (!response.ok && reject) {
      //   if(response.status>=500 ){
      //     reject(new Error(response.statusText))
      //   }
      // } 
      if(response.status == 404){
        reject('404 not found.')
      }
      return response.json().then(resolve).catch(reject)
    }

    const onError = (error: any) => {
      // retryCount--;
      // if (retryCount) {
      //   setTimeout(fetchRequest, delay);
      // } else {
        reject(error);
      // }
    }

    const rescueError = (error: any) => {
      console.warn(error)
      throw error;
    }

    function fetchRequest() {
      return fetch(input, init)
        .then(onResponse)
        .catch(onError)
        .catch(rescueError)
    }

    fetchRequest();

    if (FETCH_TIMEOUT) {
      const err = new Error("request timeout")
      setTimeout(reject, FETCH_TIMEOUT, err)
    }
  })
}

export async function DemoFetch(input: RequestInfo, init?: RequestInit, retryCount: number = 0) {
  try {
    return await Fetch(input, init, retryCount);
  } catch(err) {
    if (err && err.message === 'request timeout') {
      const code = 408
      const error = getIntlError(`${code}`)
      const isErrorCode = `${error}` === `${code}`
      globalStore.showToast({
        type: 'eduApiError',
        message: isErrorCode ? `request timeout` : error
      })
      return {code, msg: null, response: null}
    }
    if(err && err.message === 'No message available'){
      const code = 404;
      return {code, msg: null, response: null}
    }
    throw err
  }
}
export async function RestFetch(input: RequestInfo, init?: RequestInit) {

  return new Promise((resolve:(r:Response)=>void, reject) => {
    const onResponse = (response: Response) => {     

      resolve(response);
    }

    const onError = (error: any) => {
        reject(error);
    }

    const rescueError = (error: any) => {
      console.warn(error)
      throw error;
    }

    function fetchRequest() {
      return fetch(input, init)
        .then(onResponse)
        .catch(onError)
        .catch(rescueError)
    }

    fetchRequest();
 
  })
}