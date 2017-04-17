<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin" title="添加顶级域名" style="padding: 15px;">
      <x-input title="您的顶级域名" placeholder="不要加http或www" v-model="formData.domain"></x-input>
      <x-input title="网站标题" placeholder="给域名备注，方便查找，可以留空" v-model="formData.title"></x-input>
    </group>
    <box gap="0px 20px" v-if="isLogin">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="submit" type="primary">确定添加</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="list">返回顶级域名列表</x-button>
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
      formData: {domain: ''},
      icon: 'warn',
      buttons: [{type: 'primary', text: 'GotoLoginPage', link: '/user/sign'}, {type: 'default', text: 'BackHome', link: '/'}]
    }
  },
  methods: {
    list () {
      this.$router.replace('/console/domain')
    },
    submit () {
      let that = this
      var domain = that.formData.domain
      if (domain === '') {
        window.alert('域名不能留空')
        return
      }
      let msg = '<b>' + domain + '</b><br /><font color=red>添加后不能修改</font>'
      window.confirm(msg, function () {
        window.api.post('/panel/console/domain/add.php', that.formData, function (data) {
          if (data.hasOwnProperty('message')) {
            window.alert(data.message, function () {
            })
          }
        })
      }, '请核对您要添加的顶级域名')
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
