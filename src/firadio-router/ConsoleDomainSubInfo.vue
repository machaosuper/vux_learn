<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <div>
      <group v-if="isLogin" title="基本设置">
        <x-input title="您的子域名" placeholder="" v-model="domain_sub_name" disabled=""></x-input>
        <x-switch v-model="row_sub.is_enable" title="子域名总开关"></x-switch>
        <x-input title="网站名称" placeholder="给域名备注，方便查找，可以留空" v-model="row_sub.title"></x-input>
      </group>
      <box gap="10px 20px">
        <flexbox>
          <flexbox-item>
            <x-button @click.native="submitSub" type="primary" align="left">保存基本设置</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="subList">返回列表</x-button>
          </flexbox-item>
        </flexbox>
      </box>
    </div>
    <div>
      <group v-if="isLogin" title="绑定主机">
        <x-switch v-model="row_sub_bind.is_enable" title="启用绑定主机功能"></x-switch>
        <x-input title="绑定内网IP" placeholder="内网IP地址,例如10.86.3.55" v-model="row_sub_bind.lanipv4"></x-input>
        <x-input title="绑定端口号" placeholder="范围是1至65535，默认写80" v-model="row_sub_bind.lanport"></x-input>
      </group>
      <box gap="10px 20px">
        <flexbox>
          <flexbox-item>
            <x-button @click.native="submitSubBind" type="primary" align="left">保存主机绑定</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button @click.native="subList">返回列表</x-button>
          </flexbox-item>
        </flexbox>
      </box>
    </div>
  </div>
</template>

<i18n>
</i18n>

<script>
import { Msg, XInput, Group, GroupTitle, XButton, Box, Flexbox, FlexboxItem, XSwitch } from 'vux'
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['apiInited', 'isLogin']),
  components: {Msg, XInput, Group, GroupTitle, XButton, Box, Flexbox, FlexboxItem, XSwitch},
  created () {
    let that = this
    let formData = {}
    formData.domain_id = that.$route.params.domain_id
    formData.id = that.$route.params.id
    window.api.post('/panel/console/domain/sub/info.php', formData, function (data) {
      that.domain_sub_name = data.row_sub.name + '.' + data.domain.name + '.' + data.domain.tld
      that.row_sub = data.row_sub
      if (data.hasOwnProperty('row_sub_bind')) {
        that.row_sub_bind = data.row_sub_bind
      }
    })
  },
  data () {
    return {
      domain_sub_name: '--',
      row_sub: {is_enable: false},
      row_sub_bind: {is_enable: false},
      icon: 'warn',
      buttons: [{type: 'primary', text: 'GotoLoginPage', link: '/user/sign'}, {type: 'default', text: 'BackHome', link: '/'}]
    }
  },
  methods: {
    subList () {
      let that = this
      this.$router.replace('/console/domain/' + that.$route.params.domain_id + '/sub')
    },
    submitSub () {
      let that = this
      let formData = that.row_sub
      formData.domain_id = that.$route.params.domain_id
      formData.id = that.$route.params.id
      window.api.post('/panel/console/domain/sub/modify.php', formData, function (data) {
        if (data.hasOwnProperty('message')) {
          window.alert(data.message, function () {
          })
        }
      })
    },
    submitSubBind () {
      let that = this
      let formData = that.row_sub_bind
      formData.domain_id = that.$route.params.domain_id
      formData.id = that.$route.params.id
      window.api.post('/panel/console/domain/sub/bind.php', formData, function (data) {
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
