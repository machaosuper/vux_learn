<template>
  <div>
    <group>
      <cell title="昵称" :value="nickname">
        <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
      </cell>
      <x-button @click.native="logout" type="primary">退出当前账号</x-button>
    </group>
  </div>
</template>

<i18n>

</i18n>

<script>
import { Msg, XButton, Cell, Group } from 'vux'
import { mapGetters } from 'vuex'

export default {
  components: {
    Msg,
    XButton,
    Cell,
    Group
  },
  computed: mapGetters(['isLogin', 'nickname']),
  mounted () {
    if (!this.isLogin) {
      this.$router.push({path: '/user'})
    }
  },
  data () {
    return {
    }
  },
  methods: {
    logout () {
      let that = this
      window.api.post('/panel/logout.php', {}, function (data) {
        window.apiStart()
        if (data.flag === 'logouted') {
          that.$router.push({path: '/user'})
          return
        }
        if (data.hasOwnProperty('message')) {
          window.alert(data.message, function () {
            that.$router.push({path: '/user'})
          })
        }
      })
    }
  }
}
</script>
