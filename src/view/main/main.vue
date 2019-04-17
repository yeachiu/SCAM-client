<template>
  <div class="main">
    <Layout style="height: 100%;">
      <Header class="header-con">
        <Menu mode="horizontal" theme="light" active-name="home" @on-click="handleClick">
          <div class="logo-con">
            <img :src="maxLogo" key="max-logo" />
          </div>
          <div class="header-nav">
            <MenuItem name="home">
              <Icon type="ios-navigate"></Icon>
              <router-link to="/home">发现</router-link>
            </MenuItem>
            <MenuItem name="activities">
              <Icon type="ios-keypad"></Icon>
              <router-link to="/activities">我的活动</router-link>
            </MenuItem>
            <MenuItem name="my">
              <Icon type="ios-analytics"></Icon>
              <router-link to="/my">个人主页</router-link>
            </MenuItem>
            <MenuItem name="user">
              <user :user-avator="userAvator"/>
            </MenuItem>
          </div>
          
        </Menu>
      </Header>
      <Content class="main-content-con">
        <Content class="content-wrapper">
          <keep-alive :include="cacheList">
            <router-view/>
          </keep-alive>
        </Content>
      </Content>
      <Footer class="main-footer-center">2019 &copy; yeachiu</Footer>
    </Layout></Layout>
  </div>
</template>

<script>
import User from './components/user'
import Language from './components/language'
import { mapMutations, mapActions } from 'vuex'
import { getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import minLogo from '@/assets/images/ico.png'
import maxLogo from '@/assets/images/logo.png'
import './main.less'
export default {
  name: 'Main',
  components: {
    Language,
    User
  },
  data () {
    return {
      collapsed: false,
      minLogo,
      maxLogo
    }
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    userAvator () {
      return minLogo;
      //return this.$store.state.user.avatorImgPath
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'setLocal'
    ]),
    ...mapActions([
      'handleLogin'
    ]),
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleClick (name) {
      switch (name) {
        case 'my':
          this.$router.push({
            name:'my'
          })
          break;
        case 'home':
          this.$router.push({
            name:'_home'
          })
          break;
        case 'activities':
          this.$router.push({
            name:'activities'
          })
          break;
      }
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
  .logo-con{
    width: 100px;
    height: 30px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 7px;
    left: 20px;
  }
  .header-nav{
    width: 430px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .header-nav a {
    color:#515a6e;
  }
  
</style>
