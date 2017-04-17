<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin" title="域名管理" style="padding: 15px;">
      <x-input title="您的顶级域名" placeholder="" v-model="formData.domain" disabled=""></x-input>
      <x-input title="网站名称" placeholder="给域名备注，方便查找，可以留空" v-model="formData.title"></x-input>
    </group>
    <box gap="0px 20px">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="submit" type="primary" align="left">保存设置</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="sub">管理子域</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="list">返回列表</x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>

<i18n>
</i18n>

<script>
import { Msg, XInput, Group, GroupTitle, XButton, Box, Flexbox, FlexboxItem } from 'vux'
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['apiInited', 'isLogin']),
  components: {Msg, XInput, Group, GroupTitle, XButton, Box, Flexbox, FlexboxItem},
  created () {
    let that = this
    let formData = {}
    formData.id = that.$route.params.id
    window.api.post('/panel/console/domain/info.php', formData, function (data) {
      that.formData.domain = data.row.name + '.' + data.row.tld
      that.formData.title = data.row.title
    })
  },
  data () {
    return {
      formData: {domain: ''},
      icon: 'warn',
      buttons: [{type: 'primary', text: 'GotoLoginPage', link: '/user/sign'}, {type: 'default', text: 'BackHome', link: '/'}]
    }
  },
  methods: {
    sub () {
      let that = this
      this.$router.replace('/console/domain/' + that.$route.params.id + '/sub')
    },
    list () {
      this.$router.replace('/console/domain')
    },
    submit () {
      let that = this
      let formData = {}
      formData.id = that.$route.params.id
      formData.title = that.formData.title
      window.api.post('/panel/console/domain/modify.php', formData, function (data) {
        if (data.hasOwnProperty('message')) {
          window.alert(data.message, function () {
          })
        }
      })
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
