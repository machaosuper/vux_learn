<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <div v-if="isLogin">
      <group :title="group_title_domain">
        <cell v-if="rows.length===0" align="center" title="您尚未添加域名绑定记录"></cell>
        <cell v-for="row of rows" :key="row.id" :title="row.text" :link="row.link" :value="$t('Detail')">
        </cell>
      </group>
      <box gap="10px 10px">
        <flexbox>
          <flexbox-item>
            <x-button @click.native="add" type="primary">新增绑定记录</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="domainInfo">返回顶域详情</x-button>
          </flexbox-item>
        </flexbox>
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
import { Box, Msg, XButton, Cell, Group, Flexbox, FlexboxItem } from 'vux'
import { mapGetters } from 'vuex'

export default {
  components: {Box, Msg, XButton, Cell, Group, Flexbox, FlexboxItem},
  created () {
    let that = this
    let param = {}
    param.domain_id = that.$route.params.domain_id
    window.api.post('/panel/console/domain/sub/list.php', param, function (data) {
      // console.log(data)
      that.rows = data.rows
      let domain = data.domain.name + '.' + data.domain.tld
      that.group_title_domain = '域名' + domain + '的绑定记录'
      for (var key in that.rows) {
        var row = that.rows[key]
        row.text = domain
        if (row.name !== '@') {
          row.text = row.name + '.' + row.text
        }
        if (row.title !== null && row.title !== '') {
          row.text = row.text + ' (' + row.title + ')'
        }
        row.link = '/console/domain/' + that.$route.params.domain_id + '/sub/' + row.id
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
      let params = this.$route.params
      this.$router.replace('/console/domain/' + params.domain_id + '/sub/add')
    },
    domainInfo () {
      let params = this.$route.params
      this.$router.replace('/console/domain/' + params.domain_id)
    }
  }
}
</script>
