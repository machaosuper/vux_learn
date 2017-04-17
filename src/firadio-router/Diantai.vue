<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin">
      <cell :title="$t('MySite')" link="/diantai/site" :value="$t('Entry')">
        <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
      </cell>
      <cell :title="$t('MyChannel')" link="/diantai/channel" :value="$t('Entry')">
        <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
      </cell>
      <cell :title="$t('MyProgram')" link="/diantai/program" :value="$t('Entry')">
        <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
      </cell>
    </group>
  </div>
</template>

<i18n>
Entry:
  en: Entry
  zh-CN: 进入
MySite:
  en: My Site
  zh-CN: 我的电台
MyChannel:
  en: My Channel
  zh-CN: 我的频道
MyProgram:
  en: My Program
  zh-CN: 我的节目
BackHome:
  en: Back Home
  zh-CN: 返回主页
YouAreNotLogin:
  en: You Are Not Login.
  zh-CN: 您当前尚未登录
GotoLoginPage:
  en: Goto Login Page
  zh-CN: 进入登录页面
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
