<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin">
      <cell v-if="rows.length===0" align="center" title="您尚未添加顶级域名"></cell>
      <cell v-for="row of rows" :key="row.id" :title="row.text" :link="row.link" :value="$t('Detail')">
      </cell>
    </group>
    <box gap="10px 10px">
      <x-button @click.native="add" type="primary">新增顶级域名</x-button>
    </box>
    <box gap="10px 10px" align="center">
      请将您的域名<b>CNAME</b>指向到<b>cdn.firadio.net.</b>
    </box>
  </div>
</template>

<i18n>
Detail:
  en: Detail
  zh-CN: 详情
Entry:
  en: Entry
  zh-CN: 进入
ShowRecord:
  en: Show Record
  zh-CN: 查看记录
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
    window.api.post('/panel/console/domain/list.php', {}, function (data) {
      // console.log(data)
      that.rows = data.rows
      for (var key in that.rows) {
        var row = that.rows[key]
        row.text = row.name + '.' + row.tld
        if (row.title !== null) {
          row.text += ' (' + row.title + ')'
        }
        row.link = '/console/domain/' + row.id
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
    add () {
      this.$router.replace('/console/domain/add')
    }
  }
}
</script>
