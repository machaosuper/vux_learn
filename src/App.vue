<template>
  <div style="height:100%;">
    <x-dialog v-model="showRadioPlayer" class="dialog-demo" :hideOnBlur="false">
      <p class="dialog-title">{{$t('radioPlayer')}}</p>
      <div class="center">
        <video v-if="isMobile" src="http://hb2vmcdh1g874xd8ixy.exp.bcelive.com/lss-hb3ak45sw2p1y177/live.m3u8" width="100%" height="100%" controls="controls">
          您的浏览器不支持 video 标签。
        </video>
        <object v-if="isIE" id="player1"  width="365" height="64" type="application/x-mplayer2" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6">
          <param name="url" value="http://www.firadio.net/playlist.php" />
          <param name="volume" value="100" />
          <param name="AutoStart" value="0">
        </object>
        <div v-if="!isIE&&!isMobile">
          暂不支持您当前使用的浏览器<br />
          请复制下面链接到IE浏览器里打开<br />
          mms://mms.firadio.net/mayaradio<br />
        </div>
      </div>
      <x-button @click.native="setRadioPlayer(false)">{{$t('hide')}}</x-button>
    </x-dialog>
    <loading v-model="isLoading"></loading>
    <loading v-model="isLoading_api" text="服务器连接中"></loading>
    <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="55px">
      <x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;" :left-options="leftOptions"
      :title="title"
      :transition="headerTransition"
      @on-click-title="scrollTop"></x-header>
      <div style="padding: 15px 15px;" v-show="isShowBar">
        <button-tab>
          <button-tab-item :selected="$i18n.locale() === 'zh-CN'" @click.native="setLocale('zh-CN')">简体中文</button-tab-item>
          <button-tab-item :selected="$i18n.locale() === 'en'" @click.native="setLocale('en')">English</button-tab-item>
        </button-tab>
      </div>

      <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
        <router-view class="router-view"></router-view>
      </transition>

      <tabbar class="vux-demo-tabbar" icon-class="vux-center" v-show="!isTabbarDemo" slot="bottom">
        <tabbar-item :link="{path:'/'}" :selected="route.path === '/'">
          <span class="demo-icon-22 vux-demo-tabbar-icon-home" slot="icon" style="position:relative;top: -2px;">&#xe637;</span>
          <span slot="label">{{$t('Home')}}</span>
        </tabbar-item>
        <tabbar-item :link="{path:'/console'}" :selected="isConsole">
          <span class="demo-icon-22" slot="icon">&#xe633;</span>
          <span slot="label"><span v-if="consoleTitleName" class="vux-demo-tabbar-component">{{consoleTitleName}}</span><span v-else>{{$t('console')}}</span></span>
        </tabbar-item>
        <tabbar-item :link="{path:'/diantai'}" :selected="isDiantai">
          <span class="demo-icon-22" slot="icon">&#xe633;</span>
          <span slot="label"><span v-if="diantaiTitleName" class="vux-demo-tabbar-component">{{diantaiTitleName}}</span><span v-else>{{$t('diantai')}}</span></span>
        </tabbar-item>
        <tabbar-item :link="{path:'/user'}" :selected="isUser">
          <span class="demo-icon-22" slot="icon">&#xe630;</span>
          <span slot="label">{{$t('user')}}</span>
        </tabbar-item>
      </tabbar>
  </view-box>
  </div>
</template>

<i18n>
Home:
  en: Home
  zh-CN: 主页
FiradioYun:
  en: Firadio Cloud Platform
  zh-CN: 飞儿云平台
console:
  en: Console
  zh-CN: 云服务
diantai:
  en: Diantai
  zh-CN: 久留电台
user:
  en: User Center
  zh-CN: 用户中心
login:
  en: Login
  zh-CN: 登录
sign:
  en: Sign
  zh-CN: 登录
hide:
  en: Hidden Window
  zh-CN: 隐藏窗口
radioPlayer:
  en: FiRadio Player
  zh-CN: 网络电台播放器
profile:
  en: Profile
  zh-CN: 个人信息
ntuser:
  en: Windows User
  zh-CN: Windows账号
add:
  en: Add
  zh-CN: 添加
reg:
  en: Register
  zh-CN: 注册
domain:
  en: Domain
  zh-CN: 顶级域名
record:
  en: Record
  zh-CN: 记录
sub:
  en: Sub
  zh-CN: 子域
site:
  en: Site
  zh-CN: 站点
channel:
  en: Channel
  zh-CN: 频道
program:
  en: Program
  zh-CN: 节目
qq:
  en: QQ
  zh-CN: QQ号码
</i18n>

<script>
import { XDialog, XButton, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    XDialog,
    XButton,
    ButtonTab,
    ButtonTabItem,
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading
  },
  ready () {
    alert('ready')
    let that = this
    setTimeout(() => {
      that.setRadioPlayer(true)
    }, 1000)
  },
  data () {
    return {
      isLoading_api: false,
      isMobile: (function () {
        if (screen.width < screen.height) return true
        var sUserAgent = navigator.userAgent.toLowerCase()
        var bIsIpad = /ipad/i.test(sUserAgent)
        var bIsIphoneOs = /iphone os/i.test(sUserAgent)
        var bIsMidp = /midp/i.test(sUserAgent)
        var bIsUc7 = /rv:1.2.3.4/i.test(sUserAgent)
        var bIsUc = /ucweb/i.test(sUserAgent)
        var bIsAndroid = /android/i.test(sUserAgent)
        var bIsCE = /windows ce/i.test(sUserAgent)
        var bIsWM = /windows mobile/i.test(sUserAgent)
        if ((bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
          return true
        }
        return false
      })(),
      isIE: (function () {
        var sUserAgent = navigator.userAgent
        if (sUserAgent.indexOf('MSIE') >= 0) {
          return true
        }
        if (sUserAgent.indexOf('Media Center') >= 0) {
          return true
        }
        if (sUserAgent.indexOf('.NET') >= 0) {
          return true
        }
        return false
      })()
    }
  },
  methods: {
    reload () {
      document.location.reload()
    },
    scrollTop () {
      this.$refs.viewBox.scrollTo(0)
    },
    ...mapActions([
      'updateDemoPosition',
      'setSession',
      'setRadioPlayer'
    ]),
    setLocale (locale) {
      this.$i18n.set(locale)
      this.$locale.set(locale)
    },
    apiStart () {
      let that = this
      let param = {
      }
      window.api.post('/panel/session.php', param, function (data) {
        // 只要数据包返回了都给一个空对象，即使没有session
        that.setSession({})
        if (!data.hasOwnProperty('session')) {
          console.log(data)
          if (data.hasOwnProperty('message')) {
            return that.warn(data.message)
          }
          // that.warn('no session in res.data')
          return
        }
        that.setSession(data.session)
      })
    },
    warn (text) {
      this.$vux.toast.show({
        type: 'warn',
        text: text,
        width: '20em'
      })
    },
    alert (content, fun, title) {
      if (title === undefined) {
        title = '提示'
      }
      this.$vux.alert.show({
        title: title,
        content: content,
        onHide () {
          fun()
        }
      })
    },
    confirm (content, fun, title) {
      this.$vux.confirm.show({
        title: title,
        content: content,
        onConfirm () {
          fun()
        }
      })
    }
  },
  mounted () {
    let that = this
    window.api.appThis = that
    window.alert = this.alert
    window.confirm = this.confirm
    window.apiStart = this.apiStart
    this.apiStart()
    this.handler = () => {
      if (this.path === '/demo') {
        this.updateDemoPosition(this.$refs.viewBox.getScrollTop())
      }
    }
    this.box = this.$refs.viewBox.getScrollBody()
    if (this.path === '/demo') {
      this.box.addEventListener('scroll', this.handler, false)
    }
  },
  beforeDestroy () {
    this.box.removeEventListener('scroll', this.handler, false)
  },
  watch: {
    path (path) {
      if (path === '/component/demo') {
        this.$router.replace('/demo')
        return
      }
      if (path === '/demo') {
        this.box.removeEventListener('scroll', this.handler, false)
        this.box.addEventListener('scroll', this.handler, false)
      } else {
        this.box.removeEventListener('scroll', this.handler, false)
      }
      if (path === '/demo' && this.demoTop) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.box.scrollTop = this.demoTop
          }, 550)
        })
      } else {
        this.$nextTick(() => {
          this.box.scrollTop = 0
        })
      }
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      demoTop: state => state.vux.demoScrollTop,
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction,
      showRadioPlayer: state => state.vux.showRadioPlayer
    }),
    isShowBar () {
      if (/^\/$/.test(this.path)) {
        return true
      }
      return true
    },
    leftOptions () {
      return {
        showBack: this.route.path !== '/'
      }
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    titleByRoute () {
      if (this.route.path) {
        const parts = this.route.path.split('/')
        let partsT = []
        for (var i in parts) {
          var part = parts[i]
          if (part === '') {
            continue
          }
          part = this.$t(part)
          partsT.push(part)
        }
        return partsT
        // if (/component/.test(this.route.path) && parts[2]) return parts[2]
      }
    },
    titleName () {
      return this.titleByRoute.join(' - ')
    },
    consoleTitleName () {
      if (!/console/.test(this.route.path)) {
        return
      }
      let titles = this.titleByRoute
      return titles[1]
    },
    diantaiTitleName () {
      if (!/diantai/.test(this.route.path)) {
        return
      }
      let titles = this.titleByRoute
      return titles[1]
    },
    isDemo () {
      return /component|demo/.test(this.route.path)
    },
    isConsole () {
      return /console/.test(this.route.path)
    },
    isDiantai () {
      return /diantai/.test(this.route.path)
    },
    isUser () {
      return /user/.test(this.route.path)
    },
    isTabbarDemo () {
      return /tabbar/.test(this.route.path)
    },
    title () {
      if (this.route.path === '/') return this.$t('FiradioYun')
      return this.titleName ? `${this.titleName}` : '未命名'
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';

body {
  background-color: #fbf9fe;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.demo-icon-22 {
  font-family: 'vux-demo';
  font-size: 22px;
  color: #888;
}
.weui-tabbar.vux-demo-tabbar {
  /** backdrop-filter: blur(10px);
  background-color: none;
  background: rgba(247, 247, 250, 0.5);**/
}
.vux-demo-tabbar .weui-bar__item_on .demo-icon-22 {
  color: #F70968;
}
.vux-demo-tabbar .weui-tabbar_item.weui-bar__item_on .vux-demo-tabbar-icon-home {
  color: rgb(53, 73, 94);
}
.demo-icon-22:before {
  content: attr(icon);
}
.vux-demo-tabbar-component {
  background-color: #F70968;
  color: #fff;
  border-radius: 7px;
  padding: 0 4px;
  line-height: 14px;
}
.weui-tabbar__icon + .weui-tabbar__label {
  margin-top: 0!important;
}
.vux-demo-header-box {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

@font-face {
  font-family: 'vux-demo';  /* project id 70323 */
  src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot');
  src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot?#iefix') format('embedded-opentype'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.woff') format('woff'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.ttf') format('truetype'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.svg#iconfont') format('svg');
}

.demo-icon {
  font-family: 'vux-demo';
  font-size:20px;
  color: #04BE02;
}

.demo-icon:before {
  content: attr(icon);
}

/**
* vue-router transition
*/
.router-view {
  width: 100%;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  backface-visibility: hidden;
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  height: 100%;
  position: absolute;
  left: 0;
}
.vux-pop-out-enter-active {
  animation-name: popInLeft;
}
.vux-pop-out-leave-active {
  animation-name: popOutRight;
}
.vux-pop-in-enter-active {
  perspective: 1000;
  animation-name: popInRight;
}
.vux-pop-in-leave-active {
  animation-name: popOutLeft;
}
@keyframes popInLeft {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes popOutLeft {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
}
@keyframes popInRight {
  from {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes popOutRight {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
<style lang="less" scoped>
@import '~vux/src/styles/close';
.dialog-demo {
  .weui-dialog{
    border-radius: 8px;
    padding-bottom: 8px;
  }
  .dialog-title {
    background-color: #444455;
    line-height: 30px;
    color: #fff;
  }
}
</style>
