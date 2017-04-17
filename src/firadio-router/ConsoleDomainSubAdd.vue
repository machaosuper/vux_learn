<template>
  <div>
    <msg v-if="apiInited&&!isLogin" :title="$t('YouAreNotLogin')" description="" :buttons="buttons" :icon="icon"></msg>
    <group v-if="isLogin" :title="group_title" style="padding: 15px;">
      <x-input title="您的子域名" placeholder="不要加http或www" v-model="formData.name"></x-input>
      <x-input title="网站标题" placeholder="给域名备注，方便查找，可以留空" v-model="formData.title"></x-input>
    </group>
    <box gap="0px 20px" v-if="isLogin">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="submit" type="primary">确定添加</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="subList">返回记录列表</x-button>
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
      group_title: '',
      formData: {name: ''},
      icon: 'warn',
      buttons: [{type: 'primary', text: 'GotoLoginPage', link: '/user/sign'}, {type: 'default', text: 'BackHome', link: '/'}]
    }
  },
  created () {
    let that = this
    let param = {}
    param.domain_id = that.$route.params.domain_id
    window.api.post('/panel/console/domain/sub.php', param, function (data) {
      // console.log(data)
      that.rows = data.rows
      let domain = data.domain.name + '.' + data.domain.tld
      that.domain = domain
      that.group_title = '添加' + domain + '的子域名(域名记录)'
    })
  },
  methods: {
    subList () {
      this.$router.replace('/console/domain/' + this.$route.params.domain_id + '/sub')
    },
    submit () {
      let that = this
      var name = that.formData.name
      let formData = that.formData
      formData.domain_id = this.$route.params.domain_id
      if (name === '') {
        window.alert('域名不能留空')
        return
      }
      let msg = '<b>' + name + '.' + that.domain + '</b><br /><font color=red>添加后不能修改</font>'
      window.confirm(msg, function () {
        window.api.post('/panel/console/domain/sub/add.php', formData, function (data) {
          if (data.hasOwnProperty('message')) {
            window.alert(data.message, function () {
            })
          }
        })
      }, '请核对您要添加的子域名')
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
