import axios from 'axios'
import config from './config'

// axios(config)
class API {
  // 获取已授权列表
  get (param) {
    config.data.param = param.param
    return axios.post(param.api, {
    }, config)
  }
  // 添加授权
  post (path, param, fun) {
    param = JSON.stringify(param)
    config.data.param = param
    let appThis = this.appThis
    console.log(this)
    appThis.isLoading_api = true
    axios.post(path, {}, config).then(res => {
      appThis.isLoading_api = false
      if (!res.hasOwnProperty('status')) {
        appThis.warn('no status in res')
        return
      }
      if (res.status !== 200) {
        appThis.warn('res.status is ' + res.status)
        return
      }
      if (!res.hasOwnProperty('data')) {
        appThis.warn('no data in res')
        return
      }
      var data = res.data
      if (typeof (data) === 'string') {
        try {
          data = JSON.parse(data)
        } catch (ex) {
          data = {}
          appThis.warn(ex)
          return
        }
      }
      fun(data)
    }).catch(error => {
      appThis.isLoading_api = false
      appThis.warn('无法连接到服务器<br />' + error)
    })
  }
  reqSuccess (obj, msg) {
    obj.$message({
      message: msg,
      type: 'success'
    })
  }
  reqFail (obj, msg) {
    obj.$message({
      message: msg,
      type: 'success'
    })
  }
}
export default API
