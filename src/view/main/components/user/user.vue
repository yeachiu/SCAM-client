<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="my">signed in as <b>{{$store.state.user.userName}}</b></DropdownItem>
        <DropdownItem style="border-top:1px solid #ccc"></DropdownItem>
        <DropdownItem name="my">个人主页</DropdownItem>
        <!-- <DropdownItem name="stuAuth">学生认证</DropdownItem> -->
        <DropdownItem name="activities">我的活动</DropdownItem>
        <DropdownItem name="credits">我的学分</DropdownItem>
        <DropdownItem name="linktoback" v-if="hasAparId">前往后台</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  created(){
    this.checkAparId();
  },
  data(){
    return{
      hasAparId:false
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    checkAparId(){
      if(this.$store.state.user.aparId != null){
        this.hasAparId = true;
      }
    },
    handleClick (name) {
      switch (name) {
        case 'my':
          this.$router.push({
            name:'my'
          })
          break;
        case 'stuAuth':
          this.$router.push({
            name:'auth'
          })
          break;
        case 'activities':
          this.$router.push({
            name:'activities'
          })
          break;
        case 'credits':
          this.$router.push({
            name:'credits'
          })
          break;
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break;
        case 'linktoback':
          this.handleLogOut().then(() => {
            window.location.href = "http://localhost:1003"
          })
          break;
      }
    }
  }
}
</script>
