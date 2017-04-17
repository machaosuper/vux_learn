<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin" title="添加顶级域名" style="padding: 15px;">
      <x-input title="您的QQ号码" placeholder="请输入您的QQ号码" v-model="formData.qquin"></x-input>
    </group>
    <box gap="0px 20px" v-if="isLogin">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="submit" type="primary">确定添加</x-button>
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
import { Box, Msg, XInput, Group, XButton, Cell, Flexbox, FlexboxItem, XSwitch } from 'vux'
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['apiInited', 'isLogin']),
  components: {Box, Msg, XInput, Group, XButton, Cell, Flexbox, FlexboxItem, XSwitch},
  data () {
    return {
      formData: {qquin: ''},
      icon: 'warn',
      buttons: [{type: 'primary', text: 'GotoLoginPage', link: '/user/sign'}, {type: 'default', text: 'BackHome', link: '/'}]
    }
  },
  methods: {
    list () {
      this.$router.replace('/user/qq')
    },
    submit () {
      let that = this
      window.api.post('/panel/user/qq/add.php', that.formData, function (data) {
        if (data.hasOwnProperty('message')) {
          window.alert(data.message, function () {
          }, data.title)
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
