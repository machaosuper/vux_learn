<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin" title="QQ号码管理">
      <x-input title="您的QQ号码" placeholder="" v-model="formData.qquin" text-align="right" disabled=""></x-input>
      <x-input title="QQ昵称" placeholder="" v-model="formData.nickname" text-align="right" disabled=""></x-input>
      <x-input title="当前状态" placeholder="" v-model="formData.status" text-align="right" disabled=""></x-input>
      <!--<x-switch v-model="formData.is_public" title="设为主账号"></x-switch>-->
      <x-switch v-model="formData.is_public" title="公开这个QQ号码"></x-switch>
      <x-switch v-model="formData.allow_search" title="允许任何人搜索这个QQ"></x-switch>
      <x-switch v-model="formData.allow_setpwd" title="授权这个QQ可以重设密码"></x-switch>
    </group>
    <box gap="12px">
      <x-button @click.native="modify" type="primary" align="left">保存设置</x-button>
      <x-button @click.native="del" type="warn" align="left">删除QQ号码</x-button>
      <x-button @click.native="list">返回列表</x-button>
    </box>
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
    formData.id = that.$route.params.id
    window.api.post('/panel/user/qq/info.php', formData, function (data) {
      that.formData = data.row
      if (data.row.hasOwnProperty('verified') && data.row.verified !== null) {
        that.formData.status = '已验证'
      } else {
        that.formData.status = '未验证'
      }
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
    list () {
      this.$router.replace('/user/qq')
    },
    modify () {
      let that = this
      let formData = this.formData
      formData.id = that.$route.params.id
      window.api.post('/panel/user/qq/modify.php', formData, function (data) {
        if (data.hasOwnProperty('message')) {
          window.alert(data.message, function () {
          })
        }
      })
    },
    del () {
      let that = this
      let formData = {}
      formData.id = that.$route.params.id
      let msg = '确定删除QQ:' + this.formData.qquin + '？'
      window.confirm(msg, function () {
        window.api.post('/panel/user/qq/del.php', formData, function (data) {
          if (data.hasOwnProperty('message')) {
            window.alert(data.message, function () {
              if (data.flag === 'deleted') {
                that.list()
              }
            })
          }
        })
      }, '提示')
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
