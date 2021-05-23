/*  Modualize ajax request, return promise object */
import axios from 'axios'
import { message } from 'antd'

export default function request(url, data = {}, type = 'GET'){

  return new Promise((resolve, reject) => {
    let promise

    if (type === 'GET') {               // GET
      promise = axios.get(url, { 
        params: data
      })
    } else {                            // POST
      promise = axios.post(url, data)
    }
    promise.then(response => {          
      resolve(response.data)
    }).catch(error => {                 
      message.error('Request fail：' + error.message)
    })
  })
}
