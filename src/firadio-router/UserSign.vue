<template>
  <div>
    <group v-if="showGroup==='email'" :title="$t('inputemail')" style="padding: 15px;">
      <x-input :title="$t('email')" :is-type="checkEmail" :placeholder="$t('inputemail')" v-model="formData.email"></x-input>
      <x-button @click.native="emailCheck" type="primary" :disabled="!valid1">{{$t('next')}}</x-button>
      <div>
        小提示：系统会自动判断你邮箱是否注册<br />
        没注册会发邮件，已注册的可输入密码登录
      </div>
    </group>
    <group v-if="showGroup==='login'" title="用户登录" style="padding: 15px;">
      <x-input :title="$t('email')" :is-type="checkEmail" :placeholder="$t('inputemail')" v-model="formData.email"></x-input>
      <x-input title="登录密码" placeholder="请输入您的登录密码" type="password" v-model="formData.password"></x-input>
      <x-button @click.native="emailCheck" type="primary" :disabled="!valid1">登录</x-button>
      <x-button @click.native="sendvcode">找回密码</x-button>
      <x-button @click.native="showGroup='email'">返回邮箱地址检查</x-button>
    </group>
    <group v-if="showGroup==='reg'" title="用户注册" style="padding: 15px;">
      <x-input :title="$t('email')" :is-type="checkEmail" :placeholder="$t('inputemail')" v-model="formData.email"></x-input>
      <x-input title="收到的验证码" placeholder="请输入您收到的验证码" v-model="formData.vcode"></x-input>
      <x-input title="设置用户名" placeholder="可以是2至5个中文汉字或4至10个英文字母" v-model="formData.username"></x-input>
      <x-input title="设置登录密码" placeholder="请输入您要设置的登录密码" type="password" v-model="formData.password"></x-input>
      <x-button @click.native="emailCheck" type="primary" :disabled="!valid1">完成注册</x-button>
      <x-button @click.native="showGroup='email'">返回邮箱地址检查</x-button>
    </group>
    <group v-if="showGroup==='setpwd'" title="找回密码" style="padding: 15px;">
      <x-input :title="$t('email')" :is-type="checkEmail" :placeholder="$t('inputemail')" v-model="formData.email"></x-input>
      <x-input title="收到的验证码" placeholder="请输入您收到的验证码" v-model="formData.vcode"></x-input>
      <x-input title="重设登录密码" placeholder="请输入您要设置的登录密码" type="password" v-model="formData.password"></x-input>
      <x-button @click.native="emailCheck" type="primary" :disabled="!valid1">提交</x-button>
      <x-button @click.native="showGroup='email'">返回邮箱地址检查</x-button>
    </group>
  </div>
</template>

<i18n>
inputemail:
  en: Please type your E-mail
  zh-CN: 请输入您的E-mail邮箱
email:
  en: E-mail
  zh-CN: E-mail邮箱
next:
  en: Next
  zh-CN: 下一步
</i18n>

<script>
import { XInput, Group, XButton, Cell } from 'vux'
import md5 from 'blueimp-md5'

export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell
  },
  data () {
    let that = this
    return {
      showGroup: 'email',
      formData: {},
      valid1: false,
      checkEmail: function (value) {
        that.valid1 = /^[a-z0-9_-]{1,20}@[a-z0-9-]{1,20}(\.[a-z0-9-]{1,20}){0,2}(\.[a-z]{2,6})$/.test(value)
        return {
          valid: that.valid1,
          msg: '邮箱格式不正确'
        }
      }
    }
  },
  methods: {
    emailCheck () {
      let that = this
      var path = '/public/email/check.php'
      let formData = window.clone(that.formData)
      formData.password = md5(formData.password)
      if (that.showGroup === 'login') {
        path = '/public/email/login.php'
      }
      if (that.showGroup === 'reg') {
        path = '/public/email/verify/reg.php'
      }
      if (that.showGroup === 'setpwd') {
        path = '/public/email/verify/setpwd.php'
      }
      window.api.post(path, formData, function (data) {
        console.log(data)
        if (data.flag === 'blocked') {
          var msg3 = '<font color="red">' + formData.email + '</font><br />'
          msg3 += '您输入的账号异常' + '<br />'
          msg3 += '原因是: 密码尝试次数过多' + '<br />'
          msg3 += '请与客服联系'
          window.alert(msg3, function () {
          })
          return
        }
        if (data.flag === 'registered') {
          that.showGroup = 'login'
          /*
          var msg2 = '<font color="green">' + formData.email + '</font><br />'
          msg2 += '您输入的账号状态正常' + '<br />'
          msg2 += '可以输入密码进行登录了'
          window.alert(msg2, function () {
            that.showGroup = 'login'
          })
          */
          return
        }
        if (data.flag === 'unregistered') {
          var msg1 = '<font color="red">' + formData.email + '</font><br />'
          msg1 += '您输入的邮箱地址尚未注册到本系统' + '<br />'
          msg1 += '如果确认无误，请点击[确定]，' + '<br />'
          msg1 += '系统将会发送[验证码]到此邮箱，' + '<br />'
          msg1 += '如果输入有误，请点击[取消]'
          window.confirm(msg1, function () {
            window.api.post('/public/email/sendvcode.php', formData, function (data2) {
              if (data2.flag === 'showVerifyForm') {
                that.showGroup = 'reg'
              }
              if (data2.hasOwnProperty('message')) {
                window.alert(data2.message, function () {
                })
                return
              }
            })
          }, '请核对您的邮箱地址')
          return
        }
        if (data.flag === 'success') {
          window.alert(data.message, function () {
            window.apiStart()
            that.$router.push({path: '/user'})
          })
          return
        }
        if (data.flag === 'logined') {
          window.apiStart()
          that.$router.push({path: '/user'})
          return
        }
        if (data.hasOwnProperty('message')) {
          window.alert(data.message, function () {
          })
        }
      })
    },
    sendvcode () {
      let that = this
      let formData = window.clone(that.formData)
      var msg1 = ''
      msg1 += '请核对您的邮箱地址' + '<br />'
      msg1 += '<font color="red">' + formData.email + '</font><br />'
      msg1 += '如果确认无误，请点击[确定]，' + '<br />'
      msg1 += '系统将会发送[验证码]到此邮箱，' + '<br />'
      msg1 += '如果输入有误，请点击[取消]'
      window.confirm(msg1, function () {
        window.api.post('/public/email/sendvcode.php', formData, function (data) {
          that.showGroup = 'setpwd'
          if (data.hasOwnProperty('message')) {
            window.alert(data.message, function () {
            })
          }
        })
      }, '找回密码')
    }
  }
}
</script>
<style scoped>
.red {
  color: red;
}
.green {
  color: green;
}
</style>
