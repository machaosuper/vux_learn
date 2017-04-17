<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin" title="您Windows账号的登记的资料" style="padding: 15px;">
      <x-input title="登录用户名" placeholder="" v-model="infoData.username" disabled=""></x-input>
      <x-input title="登录密码" placeholder="" v-model="infoData.password" disabled=""></x-input>
      <x-input title="真实姓名" placeholder="" v-model="infoData.realname" disabled=""></x-input>
      <x-input title="绑定QQ号码" placeholder="" v-model="infoData.qquin" disabled=""></x-input>
      <x-input title="绑定手机号" placeholder="" v-model="infoData.cellphone" disabled=""></x-input>
    </group>
    <group v-if="isLogin" title="重置Windows用户密码" style="padding: 15px;">
      <x-input title="设置新密码" placeholder="" v-model="formData.password" type="password"></x-input>
    </group>
    <box gap="0px 20px" v-if="isLogin">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="submit" type="primary">确定修改密码</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="list">返回账号列表</x-button>
        </flexbox-item>
      </flexbox>
    </box>
  </div>
</template>

<i18n>
</i18n>

<script>
import { Msg, XInput, Group, XButton, Cell, Box, Flexbox, FlexboxItem } from 'vux'
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['apiInited', 'isLogin']),
  components: {Msg, XInput, Group, XButton, Cell, Box, Flexbox, FlexboxItem},
  created () {
    let that = this
    let formData = {}
    formData.id = that.$route.params.id
    window.api.post('/panel/console/ntuser/info.php', formData, function (data) {
      // console.log(data.row)
      that.infoData.username = data.row.username
      that.infoData.password = data.row.password
      that.infoData.realname = data.row.realname
      that.infoData.qquin = data.row.qquin
      that.infoData.cellphone = data.row.cellphone
    })
  },
  data () {
    return {
      infoData: {username: ''},
      formData: {password: ''},
      icon: 'warn',
      buttons: [{type: 'primary', text: 'GotoLoginPage', link: '/user/sign'}, {type: 'default', text: 'BackHome', link: '/'}]
    }
  },
  methods: {
    list () {
      this.$router.replace('/console/ntuser')
    },
    submit () {
      let that = this
      let formData = that.formData
      formData.id = that.$route.params.id
      window.api.post('/panel/console/ntuser/setpwd.php', formData, function (data) {
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
