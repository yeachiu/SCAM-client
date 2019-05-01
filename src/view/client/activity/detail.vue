<template>
  <div>
    <Row style="width:980px;margin:0 auto;margin-bottom:100px;">
      <!-- <Alert show-icon v-if="showAlert">
      友情提示
      <template slot="desc">
        <span>报名活动需要先进行</span>
        <a href="/c/my">学生认证</a>
      </template>
    </Alert> -->
      <h2 class="actiTitle">{{activityData.title}}
        <span class="star" @click="changeFocus">
          <Icon type="ios-star-outline" v-if="infocus" title="关注活动"/>
          <Icon type="md-star" color="#ffac2d" v-else title="取消关注"/>
        </span>        
      </h2> 
      <Col span="15"> 
        <div class="actiContent">
          <!-- <Col span="16" class="col"> -->
            <p>
              <span class="tt"><Icon type="md-flame" color="#ea6f5a"/>&nbsp;活动{{getStateName(activityData.status,'acti')}}</span>
            </p>   
            <p>
              <span class="tt"><Icon type="md-contacts" />&nbsp;主办方</span>&nbsp;
              <span class="cc">{{activityData.organizer.name}}</span>
            </p>
            <p>
              <span class="tt"><Icon type="ios-pin-outline" />&nbsp;地点</span>&nbsp;
              <span class="cc">{{activityData.address}}</span>
            </p>
            <p>
              <span class="tt"><Icon type="md-time" />&nbsp;报名时间</span>&nbsp;
              <span class="cc">{{dateformat(activityData.signUpTime)}} -- {{dateformat(activityData.deadlineTime)}}</span>
            </p>
            <p>
              <span class="tt"><Icon type="md-alarm" />&nbsp;活动时间</span>&nbsp;
              <span class="cc">{{dateformat(activityData.signUpTime)}} -- {{dateformat(activityData.deadlineTime)}}</span>
            </p>
        </div>
        <p class="tt" style="margin-top: 50px;"><Icon type="ios-paper" />详情</p>
        <p class="description">{{activityData.description}}</p>
      </Col>
      <Col span="8">
        <div class="actionbar">
          <span class="signupButton" @click="changeSignup" v-if="activityData.status > 1">
            <Button v-if="insignup">取消报名</Button>
            <Button v-else>报名</Button>
          </span>
          <!-- <span class="signupButton" @click="changeSignup">
            <Button>报名</Button>
          </span>   -->
        </div>
        <div class="actiImg">
          <img v-bind:src="activityData.pictureUrl" alt="活动配图" v-if="checkPath(activityData.pictureUrl)"/>
          <img v-bind:src="global_.public_img" alt="活动配图" v-else>
        </div>
        <div class="result">
          <Divider>活动结果/获奖名单</Divider>
          <div class="card">
            <p v-if="activityData.status != 4">结果未出</p>
            <!-- <Table :columns="resultColumn" :data="actiResult"></Table> -->
            <div v-else v-for="item in actiResult" :key="item.id">
              <p class="awardname">{{item.awardName}}</p>
              <p class="awarduser" v-for="user in item.winners" :key="user.id">{{user.whatClass}} - {{user.realName}}</p>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    
  </div>
</template>
<script>
import global_   from  '@/view/global.vue'
import dayjs from "dayjs";
import { post } from "@/libs/axios-cfg";
export default {
  data() {
    return {
      loading: false,
      actiId:'',
      activityData:{
        pictureUrl: '',
        title: 'zz获胜的防护服搜救zzzzzzzzzzzzzzz',
        description: 'zzzzzzzzzzzzzzzz仿vUI经济囧不是林小欧和熊咯哦11zzzzzzzzzzzzzzz',
        organizer:{
          id:'123d',name:'yguidiu'
        },
        address:'埃菲尔铁塔七楼三点钟方向',
        signUpTime: '2019-04-08 15:25:10',
        deadlineTime:'2019-04-08 15:25:10',
        startTime:'2019-04-08 15:25:10',
        endTime:'2019-04-08 15:25:10',
        limitQuota: 100,
        otherAdminlist: [
          {realName: "邱XX",stuNum: "1122344455",period:2015,profession:'信息系统',whatClass: "15信管1班"},
        ],
        isblackList: '1',
        isreview: '1',
        status:2,
        rules:'',
      },
      infocus:false,
      focusState:{},
      insignup:false,
      signupState:{},
      grouplist: [],
      actiResult:[
        {awardName:'一等奖',winners:[{realName:'user1',whatClass:'15建筑1班'},{realName:'user1',whatClass:'15建筑1班'}]},
        {awardName:'一等奖',winners:[{realName:'user1',whatClass:'15建筑1班'},{realName:'user1',whatClass:'15建筑1班'}]},
        {awardName:'一等奖',winners:[{realName:'user1',whatClass:'15建筑1班'},{realName:'user1',whatClass:'15建筑1班'}]}
      ],
      resultColumn:[
        {title:'奖项',key:'awardName'},
        {title:'名单',key:'winners'}
      ],
      showAlert:false
    };
  },
  // props: [
  //   'id'
  // ],
  created(){
    this.getData();
  },
  methods: {
    async getData(){   
      this.loading = true;
      try {
        this.actiId = this.$route.params.id;
        let res = await post('/app/activity/get/{id}',null,{
          id:this.actiId
        })
        this.activityData = res.data;
      } catch (error) {
        this.$throw(error);
      }
      if(this.checkUserAuth()){
        this.isSignup(this.activityData.id);
      }
      this.isFocus(this.activityData.id);
      this.loading = false;
    },
    close(){
      this.$emit('cancel',false);
    },
    getStateName(state,type){
      switch (type){
        case 'acti':
          return global_.getStateName(state,global_.actiStatus);
        case 'auth':
          return global_.getStateName(state,global_.authStatus);
      }		
    },
    // 时间数据处理
    dateformat(date){
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    },
    // 图片有效性检查
    async checkPath(imgPath){      
      try {
        let res = await get(imgPath);
        return true;
      } catch (error) {
        return false;
      }
    },
    // 头像加载不成功时触发
    fixAvatar(adminId){
      this.activityData.otherAdmin.forEach(ele => {
        if(ele.id === adminId){
          ele.avatar = 'https://i.loli.net/2017/08/21/599a521472424.jpg';
        }
      })
    },
    async isFocus(actiId){
      this.loading = true;
      // try {
      //   let userId = this.$store.state.user.userId;
      //   let res = await post('/app/focus/checkState/{actiId}/{userId}')
      //   this.infocus = res.data;
      // } catch (error) {
      //   this.$throw(error);
      // }
      this.loading = false;
    },
    async changeFocus(){
      this.infocus = this.infocus ? false : true;
      this.loading = true;
      try {
        let userId = this.$store.state.user.userId;
        let res = await post('/app/focus/changeState/{actiId}/{userId}',null,this.infocus);
        // this.$Message.destroy()
        // this.$Message.success({
        //   content:"关注",
        //   duration: 1
        // });
        this.infocus = res.data;
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    // 检查用户认证状态
    checkUserAuth(){
      if(this.$store.state.user.stuId == null){ //未认证
        return false;
      }
      return true;
    },
    async isSignup(actiId){
      
      
        this.loading = true;
        try {
          let data = {
            actiId : actiId,
            uid : this.$store.state.user.userId
          };
          let res = await post('/app/activity/signup/checkState',data);
          if(res.data.id != null && res.data.id != ''){
            this.insignup = true;
          }
          this.signupState = res.data;
        } catch (error) {
          this.$throw(error);
        }
        this.loading = false;
      
      
    },
    async changeSignup(){ 
      if(this.$store.state.user.stuId == null){ //已认证
        this.$Message.warning({
          duration: 3,
          render: h => {
            return h('span', [
              '报名活动需要先进行',
              h('a', {
                on:{
                  click:()=>{
                    this.$router.push({
                      path: `/c/my`,
                    })
                  }
                }
              },'学生认证')
            ])
          }
        });
      }else{
        this.loading = true;
        try {
          let res = await post('/app/activity/signup/changeState',this.signupState);
          this.insignup = this.insignup ? false : true;
        } catch (error) {
          this.$throw(error);
        }
        this.loading = false;
      }
    }
  },
  
};
</script>
<style>
  .actiTitle {
    margin: 20px 10px;
    display: inherit;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
    color: #2b85e4;
  }
  .star {
    /* color: #ffac2d; */
    font-size: 36px;
    cursor: pointer;
    margin-left: 20px;
  }
  .signupButton {
    margin-left: 12px;
  }
  .actiContent {
    
  }
  .description {
    margin: 5px 10px 8px;
    font-size: 13px;
    line-height: 24px;
    color: #999;
  }
  .tt {
    font-size: 14px;
    font-weight: bold;
    line-height: 30px;
    margin: 0 10px;
    display: inline-block;
    width: 120px;
  }
  .tt .ivu-icon {
    font-size: 24px;
    margin-right: 10px;
  }
  .actiImg {
    width: 100%;
  }
  .actiImg img {
    max-height: 200px;
    width: 100%;
  }
  .actionbar {
    margin-bottom: 20px;
    text-align: right;
  }
  .result .title {
    margin-top: 20px;
    font-size: 14px;
    color: #969696;
    padding-bottom: 10px;
    /* border-bottom: 1px solid rgb(240, 240, 240); */
}
</style>