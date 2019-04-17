<template>
  <div class="user-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="my">个人主页</DropdownItem>
        <!-- <DropdownItem name="stuAuth">学生认证</DropdownItem> -->
        <DropdownItem name="activities">我的活动</DropdownItem>
        <DropdownItem name="credits">我的学分</DropdownItem>
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
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
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
      }
    }
  }
}
</script>
