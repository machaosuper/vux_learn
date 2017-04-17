<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin" title="注册或登记Windows账号" style="padding: 15px;">
      <flexbox>
        <flexbox-item :span="8">
          <x-input title="系统账号" placeholder="请输入4至12个英文字母，用于登录系统" v-model="formData.username"></x-input>
        </flexbox-item>
        <flexbox-item>
          @firadio.net
        </flexbox-item>
      </flexbox>
      <x-input title="设置密码" placeholder="留空可以让系统自动生成" v-model="formData.password" type="password"></x-input>
      <x-input title="真实姓名" placeholder="最好是身份证上面的名字" v-model="formData.realname"></x-input>
      <x-input title="绑定QQ号码" placeholder="是取回Windows账号的凭据之一" v-model="formData.qquin"></x-input>
      <x-input title="绑定手机号" placeholder="没有手机的可以留空" v-model="formData.cellphone"></x-input>
    </group>
    <box gap="0px 20px" v-if="isLogin">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="submit" type="primary">提交注册登记</x-button>
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
import { Box, Msg, XInput, Group, XButton, Cell, Flexbox, FlexboxItem } from 'vux'
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['apiInited', 'isLogin']),
  components: {Box, Msg, XInput, Group, XButton, Cell, Flexbox, FlexboxItem},
  data () {
    return {
      formData: {},
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
      window.api.post('/panel/console/ntuser/reg.php', that.formData, function (data) {
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
