<template>
  <div class="my">
    <Row style="width:980px;margin:0 auto;margin-bottom:100px;">
      <Col span="15">
        <div class="UserCard">
          <Avatar class="userAvatar" v-bind:src="userData.avatar" @on-error="fixAvatar" size="small"/>
          <div class="title">
            <p class="name">{{userData.username}}</p>
          </div>
          <div class="info">
            <div class="meta-block">
              <p>{{signuplist.length}}</p>
              <span>已参与</span>
            </div>
            <div class="meta-block">
              <p>{{scoreCount}}</p>
              <span>我的学分</span>
            </div>
            <div class="meta-block">
              <p>{{focuslist.length}}</p>
              <span>关注</span>
            </div>
          </div>
        </div>
        <Tabs value="signup">
          <TabPane label="已报名" name="signup">
            <div class="actiList">
              <div class="listItem" v-for="(item,index) in signuplist" :key="index">
                <Col span="16" class="col">
                  <div class="content">
                    <a class="title1" target="_blank" @click="openDetailModal(item.id)">{{item.title}}</a>
                    <p class="abstract">{{item.description}}</p>
                    <div class="meta1">
					            <span style="margin: 0 5px;">
                        <Icon type="md-flame" size="14" color="#ea6f5a"/>&nbsp;{{getStateName(item.status,'acti')}}</span>
                      <span>
                        <a class="nickname" target="_blank" v-bind:href="linkToApartment">{{item.apartmentName}}</a>
                      </span>
                      <span v-if="item.status < 2">{{dateformat(item.signupTime)}} - {{dateformat(item.deadlineTime)}}</span>
                      <span v-if="item.status > 1">{{dateformat(item.startTime)}} - {{dateformat(item.endTime)}}</span>
                    </div>
                  </div>
                </Col>
                <Col span="8" class="col">
                  <div class="wrap-img">
						        <a v-bind:href="linkToDetail" target="_self">
							        <img v-bind:src="item.pictureUrl" alt="活动配图" v-if="checkPath(item.pictureUrl)"/>
                      <img v-bind:src="global_.public_img" alt="活动配图" v-else>
						        </a>
					        </div> 
                </Col>
              </div>
            </div>
          </TabPane>
          <TabPane label="历史活动" name="history">
            <div class="actiList">
              <div class="listItem" v-for="(item,index) in historylist" :key="index">
                <Col span="16" class="col">
                  <div class="content">
                    <a class="title1" target="_blank" @click="openDetailModal(item.id)">{{item.title}}</a>
                    <p class="abstract">{{item.description}}</p>
                    <div class="meta1">
					            <span style="margin: 0 5px;">
                        <Icon type="md-flame" size="14" color="#ea6f5a"/>&nbsp;{{getStateName(item.status,'acti')}}</span>
                      <span>
                        <a class="nickname" target="_blank" v-bind:href="linkToApartment">{{item.apartmentName}}</a>
                      </span>
                      <span v-if="item.status < 2">{{dateformat(item.signupTime)}} - {{dateformat(item.deadlineTime)}}</span>
                      <span v-if="item.status > 1">{{dateformat(item.startTime)}} - {{dateformat(item.endTime)}}</span>
                    </div>
                  </div>
                </Col>
                <Col span="8" class="col">
                  <div class="wrap-img">
                    <a v-bind:href="linkToDetail" target="_self">
                      <img v-bind:src="item.pictureUrl" alt="活动配图" v-if="checkPath(item.pictureUrl)"/>
                      <img v-bind:src="global_.public_img" alt="活动配图" v-else>
                    </a>
                  </div>  
                </Col>
              </div>
            </div>
          </TabPane>
          <TabPane label="已关注" name="focus">
            <div class="actiList">
              <div class="listItem" v-for="(item,index) in focuslist" :key="index" @click="openDetailModal(item.id)">
                <Col span="16" class="col">
                  <div class="content">
                    <a class="title1" target="_blank" @click="openDetailModal(item.id)">{{item.title}}</a>
                    <p class="abstract">{{item.description}}</p>
                    <div class="meta1">
					            <span style="margin: 0 5px;"><Icon type="md-flame" size="14" color="#ea6f5a"/>&nbsp;{{getStateName(item.status,'acti')}}</span>
                      <span>
                        <a class="nickname" target="_blank" v-bind:href="linkToApartment">{{item.apartmentName}}</a>
                      </span>
					            <span v-if="item.status < 2">{{dateformat(item.signupTime)}} - {{dateformat(item.deadlineTime)}}</span>
                      <span v-if="item.status > 1">{{dateformat(item.startTime)}} - {{dateformat(item.endTime)}}</span>    
                    </div>
                  </div>
                </Col>
                <Col span="8" class="col">
                  	<div class="wrap-img">
						          <a v-bind:href="linkToDetail" target="_self">
							          <img v-bind:src="item.pictureUrl" alt="活动配图" v-if="checkPath(item.pictureUrl)"/>
                        <img v-bind:src="global_.public_img" alt="活动配图" v-else>
						          </a>
					          </div> 
                </Col>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Col>
      <Col span="8" class="aside">
        <p class="title" style="border-bottom: 1px solid #f0f0f0;">
          <span>学生认证</span>
          <span class="editIntro" v-if="userData.userAuth.status==2">已认证</span>
          <span class="editIntro" v-else-if="userData.userAuth.status==1">认证中</span>
          <Button class="editIntro" type="info" size="small" style="color:#fff;" @click="edit" v-else>立即认证</Button>
        </p>
		    <div style="padding:10px;" v-if="userData.userAuth != null">
			    <div class="card" v-if="userData.userAuth.status==2">
            <p>姓名 : {{ userData.userAuth.realName }}</p>
            <p>学号 : {{ userData.userAuth.stuNum }}</p>
            <p>年级 : {{ userData.userAuth.period }}级</p>
            <p>专业 : {{ userData.userAuth.profession }}</p>
            <p>班级 : {{ userData.userAuth.className }}</p>
          </div>
          <Form ref="formAuth" label-position="right" :rules="ruleValidate" :label-width="50" v-if="showFormAuth">
            <FormItem label="姓名" prop="realName">
              <Input v-model="formAuth.realName" size="small"></Input>
            </FormItem>
            <FormItem label="学号" prop="stuNum">
              <Input v-model="formAuth.stuNum" size="small"></Input>
            </FormItem>
            <FormItem label="年级">
              <InputNumber :mix="1" :max="2100" v-model="formAuth.period" style="width: 100%;"  size="small"
              :formatter=" value => `${value}级` " :parser="value => value.replace('级', '')"/>
            </FormItem>
            <FormItem label="专业">
              <!-- //从数字字典找专业 -->
              <Select v-model="profession" filterable size="small">
                <Option v-for="option in professOptions" :value="option.id" :key="option.id">{{option.title}}</Option>
              </Select>
            </FormItem>
            <p class="prev-notice">{{validateNotice}}</p>
            <FormItem label="班级"  prop="stuClass">
              <!-- //根据选择的专业找班级 -->
              <Select v-model="formAuth.stuClass" filterable size="small">
                <Option v-for="option in classOptions" :value="option.id" :key="option.id">{{option.title}}</Option>
              </Select>
            </FormItem>
            <FormItem style="text-align: center;">
              <Button type="primary" @click="submitAuth" size="small">提交认证</Button>
              <Button style="margin-left: 15px" @click="cancelAuth" size="small">&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;</Button>
            </FormItem>
          </Form>
        </div>
        <p class="title">
          <span>个人资料</span>
          <span class="editIntro" @click="editMess">
            <Icon type="ios-brush-outline"/>编辑
          </span>
        </p>
        <div class="myMess">
          <div class="card">
            <p>phone : {{ userData.phone }}</p>
          </div>
        </div>
      </Col>
    </Row>
    <ActiDetailModal v-if="showDetail" :id="detailId" @cancel="closeDetailModal"/>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { post, get } from "@/libs/axios-cfg";
import global_   from  '@/view/global.vue'
import ActiDetailModal from './component/detail.vue'
/** 活动状态 **/
  let ACT_STATUS_DRAFT = 1;   //草稿
  let ACT_STATUS_PUBLISH = 2;   //已发布
  let ACT_STATUS_PROCESS = 3;   //进行中
  let ACT_STATUS_COMPLETE = 4;   //已结束
  let ACT_STATUS_CANCEL = 0;  //已取消

export default {
  components:{
	  ActiDetailModal,global_
  },
  data() {	
    return {
	  loading: false,
	  showDetail: false,
	  showFormAuth:false,
    userData: {},
    activityData:[],
    signuplist: [],
    focuslist: [],
    historylist: [],
    scoreCount:null,
    linkToApartment: "",
    //学生认证相关属性
      formAuth:{
        id:'',
        realName:'',
        stuNum:'',
        period: dayjs().year(),
        profession:'',		//	id
        stuClass:'',		//id
      },
      ruleValidate:{
        realName:[
          {required:true,message:'姓名不能为空', trigger:'blur'}
        ],
        stuNum:[
          {required:true,message:'学号不能为空', trigger:'blur'}          
        ]
      },
	    professOptions:[],
      classOptions:[],
      
    validateNotice:'',  //// unsure
    profession:'',    // unsure
	  linkToDetail:'',
    };
  },
  created() {
	this.findAllProfession();
    this.getData();
  },
  methods: {
    getData() {
      this.getUserData();
      this.getActivityData();
      this.findAllProfession();
    },
    async getUserData(){
      this.loading = true;
      let userId = this.$store.state.user.userId;
      try {
        const res = await post('/sys/user/c/get/id/{id}',null,{
          id:this.$store.state.user.userId
        });
        this.userData = res.data;
        if(res.data.userAuth == null){
          this.userData.userAuth = {
            status : 0,
            realName: null,
            stuNum: null,
            period: null,
            profession: null,
            className: null
          }
        }
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    async getActivityData(){
      this.loading = true;
      try {
        const res = await post('/app/activity/get/list/join/userId/{userId}',null,{
          userId:this.$store.state.user.userId
        });
        this.activityData = res.data;
        this.sortActivityData();
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    sortActivityData(){
      let signup = new Array();
      let history = new Array();
      this.activityData.forEach(acti => {
        switch (acti.status){
          case ACT_STATUS_PUBLISH:
            signup.push(acti);
            break;
          case ACT_STATUS_PROCESS:
            signup.push(acti);
            break;
          case ACT_STATUS_COMPLETE:
            history.push(acti);
            break;
        }
      })
      this.signuplist = signup;
      this.historylist = history;
    },
    async getFocusActivities(){
      this.loading = true;
      try {
        const res = await post('/app/activity/get/list/focus/userId/{userId}',null,{
          userId:this.$store.state.user.userId
        });
        this.activityData = res.data;
        this.sortActivityData();
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    },
    edit() {
      this.showFormAuth = true;
    },
    editMess() {
      alert("modal");
    },
    openDetailModal(val) {
      this.detailId = val;
	  this.showDetail = true;
	},
	closeDetailModal(val){
		this.showDetail = val;
	},
	getStateName(state,type){
		switch (type){
			case 'acti':
				return global_.getStateName(state,global_.actiStatus);
			case 'auth':
				return global_.getStateName(state,global_.authStatus);
		}
		
  },
  // 头像加载不成功时触发
    fixAvatar(){
      this.userData.avatar = 'https://i.loli.net/2017/08/21/599a521472424.jpg';
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
	// 学生认证
	async findAllProfession(){
		this.loading = true;
		try {
			const res = await post('/app/group/list/profession');
			this.professOptions = res.data;
		} catch (error) {
			this.$throw(error);
		}
		this.loading = false;
  },
  //监听this.formAuth.profession，根据属性值获取班级数据
	async findByProfession(){
    this.loading = true;
		if(this.formAuth.profession == ''){
			this.$Message.warning('请先选择您的专业');
			return;
    }
    let data = {
      professionId : this.formAuth.profession,
      period : this.formAuth.period
    };
		try{
			const res = await post('/app/group/list/clazz/',data)
	  		this.classOptions = res.data;
		}catch(error){
			this.$throw(error);
		}
		this.loading = false;
	},
	async submitAuth(){
		let pass = false;
		this.$refs.formAuth.validate((valid) => {
      console.log("validate:" + valid)
			if (valid) {
				pass = true;
			}
    })
    if(pass){
      this.loading = true; 
      try {
        const res = await post('/system/user/auth/add', this.formAuth);
        this.getData(false)
        this.$Message.destroy()
        this.$Message.success({
          content:"认证提交成功",
          duration: 1.5
        });
      } catch (error) {
        this.$throw(error);
      }
      this.loading = false;
    }
    
	},
	cancelAuth(){
		this.showFormAuth = false;
	},
	/*********************end*/
  },
  watch:{
	profession: function(newVal,oldVal){
	  this.formAuth.profession = newVal;
	  this.findByProfession();
	}
  }
};
</script>
<style>
  
  .my .UserCard {
    word-wrap: break-word;
    margin-bottom: 20px;
    padding: 0 0 10px 5px;
  }
  .my .UserCard .userAvatar {
    color: rgb(245, 106, 0);
    background-color: rgb(253, 227, 207);
    float: left;
    margin: 24px 15px;
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 30px;
  }
  .my .UserCard .userAvatar .ivu-avatar > * {
    line-height: 60px;
  }
  .my .UserCard .title {
    padding: 20px 0px 0 10px;
    margin-left: 60px;
  }
  .my .UserCard .title .name {
    /* display: inline; */
    font-size: 21px;
    font-weight: 700;
    vertical-align: middle;
  }
  .my .UserCard .info,
  .my .UserCard .info a {
    margin-left: 60px;
    margin-top: 10px;
    font-size: 14px;
    color: #969696;
    padding-left: 10px;
  }
  .my .info {
    color: #c3c3c3;
  }
  .my .info span {
    margin: 0 5px;
  }

  .my .info .meta-block {
    font-size: 12px;
    margin: 0 7px 6px 0;
    padding: 0 7px 0 0;
    border-right: 1px solid #f0f0f0;
    display: inline-block;
  }
  .my .info .meta-block p {
    font-size: 14px;
    text-align: center;
    font-weight: bold;
  }
  .my .memItem {
    padding: 25px 0;
    border-bottom: 1px dotted #ddd;
  }
  .my .aside {
    padding: 20px 0 0 20px;
  }
  .my .aside .title {
    /* float: left; */
    margin-bottom: 10px;
    font-size: 14px;
    color: #969696;
    padding-bottom: 20px;
    padding-top: 10px;
  }
  .my .aside .description {
    position: relative;
    margin-bottom: 20px;
    padding: 0 0 16px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
    clear: both;
    word-break: break-word !important;
    word-break: break-all;
  }

  .my .editIntro {
    cursor: pointer;
    color: #999;
    float: right;
    font-size: 12px;
  }
  .my .myMess {
    margin-left: 10px;
    line-height: 20px;
  }

  /* ********************************************************** */
  
  .my .actiList .listItem {
    height: 130px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    word-wrap: break-word;
    background: #fff;
  }
  .my .actiList .listItem .ivu-card-body {
    height: 100%;
  }
  .my .actiList .col {
    height: 100%;
  }
  .my .actiList .content {
    padding-right: 10px;
  }
  .my .actiList .title1 {
    margin: 0px 0px;
    display: inherit;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
  }
  .my .actiList .abstract {
    margin: 5px 10px 8px;
    font-size: 13px;
    line-height: 24px;
    color: #999;
  }
  .my .actiList .meta1 {
    padding-right: 0 !important;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    position: absolute;
    bottom: 0px;
  }

  .my .actiList .meta1 span {
    margin: 0 5px;
  }
  .my .card:hover {
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      border-color: #eee;
  }
  .my .card {
      background: #fff;
      border-radius: 4px;
      font-size: 14px;
      position: relative;
      transition: all 0.2s ease-in-out;
      padding: 16px;
  }
  .my .wrap-img {
    width: 200px;
    height: 200px;
    overflow: hidden;
  }
  .my .wrap-img img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }
</style>
