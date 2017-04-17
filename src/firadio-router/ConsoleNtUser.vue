<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <div v-if="isLogin">
      <group style="padding: 15px;">
        <div v-if="rows.length===0" align="center">您当前尚未注册或登记Windows账号</div>
        <cell v-for="row of rows" :key="row.id" :title="row.title" :link="row.link" :value="$t('Detail')">
        </cell>
      </group>
      <box gap="0px 20px">
        <x-button @click.native="reg" type="primary">注册或登记新的Windows账号</x-button>
      </box>
    </div>
  </div>
</template>

<i18n>
Detail:
  en: Detail
  zh-CN: 详情
Entry:
  en: Entry
  zh-CN: 进入
MyWindowsUser:
  en: My Windows User
  zh-CN: 我的Windows账号
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
import { Box, Msg, XButton, Cell, Group } from 'vux'
import { mapGetters } from 'vuex'

export default {
  components: {Box, Msg, XButton, Cell, Group},
  created () {
    let that = this
    window.api.post('/panel/console/ntuser/list.php', {}, function (data) {
      that.rows = data.rows
      for (var key in that.rows) {
        var row = that.rows[key]
        var status = '(审核中)'
        console.log(row)
        if (row.verified) {
          status = '(已审核)'
        }
        if (row.processed) {
          status = '(已开通)'
        }
        row.title = row.username + '@firadio.net ' + status
        row.link = '/console/ntuser/' + row.id
      }
    })
  },
  computed: mapGetters(['apiInited', 'isLogin', 'nickname']),
  data () {
    return {
      icon: 'warn',
      buttons: [{type: 'primary', text: 'GotoLoginPage', link: '/user/sign'}, {type: 'default', text: 'BackHome', link: '/'}],
      rows: []
    }
  },
  methods: {
    reg () {
      this.$router.replace('/console/ntuser/reg')
    }
  }
}
</script>
