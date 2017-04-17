<template>
  <div>
    <div class="center">
      <img src="/static/images/firadio.gif" width="90%" />
    </div>
    <group>
      <cell :title="$t('welcome')" link="/console" :value="$t('gotoConsole')">
        <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
      </cell>
      <x-switch v-model="showRadioPlayer" :title="$t('showPlayer')" @click.native="clickRadioPlayer"></x-switch>
    </group>
  </div>
</template>

<i18n>
welcome:
  en: Welcome
  zh-CN: 欢迎使用
showPlayer:
  en: Show Radio Player
  zh-CN: 显示网络电台播放器
gotoConsole:
  en: Goto Console
  zh-CN: 进入控制台
</i18n>

<script>
import { Cell, Group, Badge, XSwitch, XDialog } from 'vux'
import { mapState, mapActions } from 'vuex'
const version = require('../../package.json').version
export default {
  components: {
    Cell,
    Group,
    Badge,
    XSwitch,
    XDialog
  },
  data () {
    return {
      version: version
    }
  },
  computed: {
    ...mapState({
      showRadioPlayer: state => state.vux.showRadioPlayer
    })
  },
  methods: {
    ...mapActions([
      'setRadioPlayer'
    ]),
    clickRadioPlayer () {
      this.setRadioPlayer(!this.showRadioPlayer)
    }
  }
}
</script>

<style scoped>
.center {
  margin-top: 15px;
  text-align: center;
}
.vux-notice {
  color: #666;
  line-height: 40px;
}
.demo-icon {
  margin-right: 15px;
}
.vux-title {
  vertical-align: middle;
  text-align: center;
  color: #04BE02;
  display: inline-block;
  width: 75px;
  height: 75px;
  line-height: 75px;
  border-radius: 50%;
}
body {
  font-family: Helvetica, sans-serif;
  background-color: #fbf9fe;
}
</style>
