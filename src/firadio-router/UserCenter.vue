<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin">
      <cell :title="$t('CurrentLogined')" link="/user/profile" :value="nickname">
        <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
      </cell>
      <cell :title="$t('MyQQ')" link="/user/qq" value="进入">
        <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
      </cell>
    </group>
  </div>
</template>

<i18n>
CurrentLogined:
  en: Current Logined
  zh-CN: 当前登录
MyQQ:
  en: My QQ Number
  zh-CN: 我的QQ号码
BackHome:
  en: Back Home
  zh-CN: 返回主页
YouAreNotLogin:
  en: You Are Not Login.
  zh-CN: 您当前尚未登录
GotoLoginPage:
  en: Register or Login
  zh-CN: 注册 或 登录
</i18n>

<script>
import { Msg, XButton, Cell, Group } from 'vux'
import { mapGetters } from 'vuex'

export default {
  components: {
    Msg,
    XButton,
    Cell,
    Group
  },
  computed: mapGetters(['apiInited', 'isLogin', 'nickname']),
  data () {
    return {
      description: 'msg description',
      icon: 'warn',
      buttons: [{
        type: 'primary',
        text: 'GotoLoginPage',
        link: '/user/sign'
      }, {
        type: 'default',
        text: 'BackHome',
        link: '/'
      }]
    }
  }
}
</script>
