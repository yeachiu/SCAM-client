<template>
  <div>
    <Modal v-model="show" title="添加活动"
            :mask-closable="false" :closable="false">
    <!-- <Card :bordered="false" dis-hover> -->
      <p slot="title">
        <Steps :current="current" style="margin-left: 10%;">
          <Step title="基本信息" icon="ios-person"></Step>
          <Step title="报名表单" icon="ios-camera"></Step>
          <Step title="学分配置" icon="ios-mail"></Step>
      </Steps>
      </p>   
      <Card :bordered="false" v-show = "current == 0"  dis-hover>
        <BaseForm ref="baseForm" :apartmentId="apartmentId" :user="user" v-on:submitData="cacheBaseData" class="TabContent"/>
      </Card>
      <Card :bordered="false" v-show = "current == 1"  dis-hover>
        <SignupForm ref="signupForm" v-on:submitData="cacheSignupData" class="TabContent"/>
      </Card>
      <Card :bordered="false" v-show = "current == 2"  dis-hover style="min-height:400px;">
        <ScoreSettingForm ref="scoreForm" v-on:submitData="cacheScoreData" class="TabContent"/>
      </Card>
      <div id="button-group">
        <template v-if="current == 2">
          <Button type="primary" @click="prev">上一步</Button>
          <Button type="primary" @click="save(0)">存为草稿</Button>
          <Button type="primary" @click="save(1)">保存发布</Button>
        </template>
        <template v-else>
          <Button type="primary" @click="prev">上一步</Button>
          <Button type="primary" @click="next">下一步</Button>
        </template>
      </div>
    <!-- </Card> -->
    </Modal>
  </div>
</template>
<script>
import { post } from '@/libs/axios-cfg'
import axios from 'axios';
import qs from 'qs'
import BaseForm from '@/view/app/activity/activity/components/base-form.vue'
import SignupForm from '@/view/app/activity/activity/components/signup-form.vue'
import ScoreSettingForm from '@/view/app/activity/activity/components/score-setting-form.vue'
export default {
  data () {
    return {
      current: 0,
      baseDatas:{},
      scoreData:{},
      finalDatas:{
        pictureUrl: '',
        title: '',
        description: '',
        signUpTime: null,
        deadlineTime:null,
        startTime:null,
        endTime:null,
        limitQuota: 100,
        otherAdmin: '',
        isblackList: '1',
        isreview: '1',
        groupId: '',
        status:0,
        rules:'',
        scoreData:''
      },
      apartmentId:'',
      user:null
    }
  },
  components:{
    BaseForm,SignupForm,ScoreSettingForm
  },
  methods: {
    next () {
      if (this.current == 2) {
        this.current = 0;
      } else {
        this.current += 1;
      }
    },
    prev () {
      if (this.current == 0) {
        this.current = 0;
      } else {
        this.current -= 1;
      }
    },
    async save(type){
      this.$refs.baseForm.$emit("submitBaseData");
      this.$refs.signupForm.$emit("submitSignupData");
      this.$refs.scoreForm.$emit("submitScoreData");
      this.finalDatas.status = type;
      // if(this.baseDatas.otherAdmin == null && this.baseDatas.otherAdmin.length < 0){
      //   return;
      // }
      // if(this.baseDatas.groupId == null && this.baseDatas.groupId ==''){
      //   return;
      // }
      // let finalDatas = new FormData();
      // finalDatas.append("picture",this.baseDatas.picture);
      // finalDatas.append("title",this.baseDatas.title);
      // finalDatas.append("description",this.baseDatas.description);
      // finalDatas.append("signUpTime",this.baseDatas.datetimeSignup[0]);
      // finalDatas.append("deadlineTime",this.baseDatas.datetimeSignup[1]);
      // finalDatas.append("startTime",this.baseDatas.datetimeAct[0]);
      // finalDatas.append("endTime",this.baseDatas.datetimeAct[1]);
      // finalDatas.append("status",type);
      // finalDatas.append("otherAdmin",this.baseDatas.otherAdmin);
      // finalDatas.append("groupId",this.baseDatas.groupId);
      // finalDatas.append("limitQuota",this.baseDatas.limitQuota);
      // finalDatas.append("isblackList",this.baseDatas.isblackList);
      // finalDatas.append("isreview",this.baseDatas.isreview); 
      // finalDatas.append("rules",this.finalData.rules); 
      // finalDatas.append("scoreData",this.finalData.scoreData); 
      // console.info("xixixi:"+finalDatas);
      try {
        await post('/app/activity/add',this.finalDatas)
        this.getData(false)
        this.$Message.destroy()
        this.$Message.success({
            content:"活动添加成功",
            duration: 1.5
        });
      } catch (error) {
        this.$throw(error)
      }
      // axios.post('http://localhost:1000/app/activity/add',finalDatas,{
      //   headers: {'Content-Type': 'multipart/form-data'}
      //   }).then(result => {
      //     // this.getData(false)
      //     this.$Message.destroy()
      //     this.$Message.success({
      //         content:"活动添加成功",
      //         duration: 1.5
      //     });
      // })
    },
    cacheBaseData(val){
      console.log("乖宝贝^3^");
      let baseDatas = val;
      // if(baseDatas.otherAdmin != null && baseDatas.otherAdmin.length > 0){
        this.finalDatas.otherAdmin = String(baseDatas.otherAdmin);
      // }
      // if(baseDatas.groupId != null && baseDatas.groupId.length > 0){
        this.finalDatas.groupId = String(baseDatas.groupId);
      // }
      this.finalDatas.title = baseDatas.title;
      this.finalDatas.description = baseDatas.description;
      this.finalDatas.pictureUrl = baseDatas.pictureUrl;
      this.finalDatas.signUpTime = baseDatas.datetimeSignup[0];
      this.finalDatas.deadlineTime = baseDatas.datetimeSignup[1];
      this.finalDatas.startTime = baseDatas.datetimeAct[0];
      this.finalDatas.endTime = baseDatas.datetimeAct[1];
      this.finalDatas.limitQuota = baseDatas.limitQuota;
      this.finalDatas.isblackList = baseDatas.isblackList;
      this.finalDatas.isreview = baseDatas.isreview; 
      console.info(this.finalDatas);
    },
    cacheSignupData(val){
      console.log("乖宝贝^3^");
      this.finalDatas.rules = JSON.stringify(val);
    }, 
    cacheScoreData(val){
      console.log("乖宝贝^3^");
      this.finalDatas.scoreData = JSON.stringify(val);
    }    
  }
}
</script>

<style>
  .step-bar{
    width: 100%;
    text-align: center;
  }
  #button-group{
    width: 100%;
    text-align: center;
  }
  #button-group button{
    margin-right:7% !important; 
  }
  .TabContent {
    margin:0 auto;
  }
</style>

