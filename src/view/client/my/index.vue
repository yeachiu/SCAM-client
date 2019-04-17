<template>
  <div>
    <Row style="width:980px;margin:0 auto;margin-bottom:100px;">
      <Col span="15">
        <div class="UserCard">
          <Avatar class="userAvatar">avatar</Avatar>
          <div class="title">
            <p class="name">{{userData.username}}</p>
          </div>
          <div class="info">
            <div class="meta-block">
              <p>{{userData.signuplist.length}}</p>
              <span>已参与</span>
            </div>
            <div class="meta-block">
              <p>{{userData.score}}</p>
              <span>我的学分</span>
            </div>
            <div class="meta-block">
              <p>{{userData.focuslist.length}}</p>
              <span>关注</span>
            </div>
          </div>
        </div>
        <Tabs value="signup">
          <TabPane label="已报名" name="signup">
            <div class="actiList">
              <div class="listItem" v-for="(item,index) in userData.signuplist" :key="index">
                <Col span="16" class="col">
                  <div class="content">
                    <a class="title1" target="_blank" @click="openDetailModal(item.id)">{{item.title}}</a>
                    <p class="abstract">{{item.description}}</p>
                    <div class="meta1">
					  <span style="margin: 0 5px;"><Icon type="md-flame" size="14" color="#ea6f5a"/>&nbsp;{{getStateName(item.status,'acti')}}</span>
                      <span>
                        <a
                          class="nickname"
                          target="_blank"
                          v-bind:href="linkToApartment"
                        >{{item.apartmentName}}</a>
                      </span>
                      <span v-if="item.status<2">{{item.signupTime}} - {{item.deadlineTime}}</span>
                      <span v-if="item.status>1">{{item.startTime}} - {{item.endTime}}</span>
                    </div>
                  </div>
                </Col>
                <Col span="8" class="col">
                    <div class="wrap-img">
						<a v-bind:href="linkToDetail" target="_self">
							<img class="img-blur-done" v-bind:src="checkPath(item.imgPath)" alt="120">
						</a>
					</div> 
                </Col>
              </div>
            </div>
          </TabPane>
          <TabPane label="历史活动" name="history">
            <div class="actiList">
              <div class="listItem" v-for="(item,index) in userData.historylist" :key="index">
                <Col span="16" class="col">
                  <div class="content">
                    <a class="title1" target="_blank" @click="openDetailModal(item.id)">{{item.title}}</a>
                    <p class="abstract">{{item.description}}</p>
                    <div class="meta1">
					  <span style="margin: 0 5px;"><Icon type="md-flame" size="14" color="#ea6f5a"/>&nbsp;{{getStateName(item.status,'acti')}}</span>
                      <span>
                        <a
                          class="nickname"
                          target="_blank"
                          v-bind:href="linkToApartment"
                        >{{item.apartmentName}}</a>
                      </span>
                      <span v-if="item.status<2">{{item.signupTime}} - {{item.deadlineTime}}</span>
                      <span v-if="item.status>1">{{item.startTime}} - {{item.endTime}}</span>
                    </div>
                  </div>
                </Col>
                <Col span="8" class="col">
					<div class="wrap-img">
						<a v-bind:href="linkToDetail" target="_self">
							<img class="img-blur-done" v-bind:src="checkPath(item.imgPath)" alt="120">
						</a>
					</div>  
                </Col>
              </div>
            </div>
          </TabPane>
          <TabPane label="已关注" name="focus">
            <div class="actiList">
              <div
                class="listItem"
                v-for="(item,index) in userData.focuslist"
                :key="index"
                @click="openDetailModal(item.id)">
                <Col span="16" class="col">
                  <div class="content">
                    <a class="title1" target="_blank" @click="openDetailModal(item.id)">{{item.title}}</a>
                    <p class="abstract">{{item.description}}</p>
                    <div class="meta1">
					  <span style="margin: 0 5px;"><Icon type="md-flame" size="14" color="#ea6f5a"/>&nbsp;{{getStateName(item.status,'acti')}}</span>
                      <span>
                        <a
                          class="nickname"
                          target="_blank"
                          v-bind:href="linkToApartment"
                        >{{item.apartmentName}}</a>
                      </span>
					  <span v-if="item.status>2">{{item.startTime}} - {{item.endTime}}</span>
                      <span v-else>{{item.signupTime}} - {{item.deadlineTime}}</span>      
                    </div>
                  </div>
                </Col>
                <Col span="8" class="col">
                  	<div class="wrap-img">
						<a v-bind:href="linkToDetail" target="_self">
							<img class="img-blur-done" v-bind:src="checkPath(item.imgPath)" alt="120">
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
          <Button
            class="editIntro"
            type="info"
            size="small"
            style="color:#fff;"
            @click="edit"
            v-if="userData.authStatus==-1"
          >立即认证</Button>
          <span class="editIntro" v-if="userData.authStatus==0">认证中</span>
          <span class="editIntro" v-if="userData.authStatus==1">已认证</span>
        </p>
		<div style="padding:10px;">
			<div class="card" v-if="userData.authStatus==1">
				<p>姓名 : {{ userData.userAuth.realName }}</p>
				<p>学号 : {{ userData.userAuth.stuNum }}</p>
				<p>年级 : {{ userData.userAuth.period }}级</p>
				<p>专业 : {{ userData.userAuth.profession }}</p>
				<p>班级 : {{ userData.userAuth.whatClass }}</p>
			</div>
			<Form ref="formAuth" label-position="right" :rules="ruleValidate" :label-width="50" v-if="showFormAuth">
				<FormItem label="姓名" prop="realName">
					<Input v-model="formAuth.realName" size="small"></Input>
				</FormItem>
				<FormItem label="学号" prop="stuNum">
					<Input v-model="formAuth.stuNum" size="small"></Input>
				</FormItem>
				<FormItem label="年级">
					<InputNumber :mix="2000" :max="2100" v-model="formAuth.period" style="width: 100%;"  size="small"
					:formatter=" value => `${value}级` " :parser="value => value.replace('级', '')"/>
				</FormItem>
				<FormItem label="专业">
					<!-- //从数字字典找专业 -->
					<Select v-model="profession" filterable size="small">
						<Option v-for="(option, index) in professOptions" :value="option.value" :key="index">{{option.label}}</Option>
					</Select>
				</FormItem>
				<p class="prev-notice">{{validateNotice}}</p>
				<FormItem label="班级"  prop="stuClass">
					<!-- //根据选择的专业找班级 -->
					<Select v-model="formAuth.stuClass" filterable size="small">
						<Option v-for="(option, index) in classOptions" :value="option.value" :key="index">{{option.label}}</Option>
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


export default {
  components:{
	  ActiDetailModal,global_
  },
  data() {	
    return {
	  loading: false,
	  showDetail: false,
	  showFormAuth:false,
      userData: {
        id: "111111",
        username: "舒雪吉用户",
        score: 10,
        authStatus: -1,
		phone: "13659845621",
		userAuth:{
        	realName: "邱XX",
			stuNum: "1122344455",
			period:2015,
			profession:'信息系统',
        	whatClass: "15信管1班",			
		},
        signuplist: [
          {
            id: "1000",
            title: "活动一",
            description: "活动一描述",
            status: 1,
            apartmentName: "uygvkuygk",
            imgPath: "",
            signupTime: "2019-04-09",
            deadlineTime: "2019-04-09",
            startTime: "2019-04-09",
            endTime: "2019-04-09"
          },
          {
            id: "2000",
            title: "活动二",
            description: "活动二描述",
            status: 0,
            apartmentName: "uygvkuygk",
            imgPath: "",
            signupTime: "2019-04-09",
            deadlineTime: "2019-04-09",
            startTime: "2019-04-09",
            endTime: "2019-04-09"
          },
          {
            id: "3000",
            title: "活动三",
            description: "活动三描述",
            status: 2,
            apartmentName: "uygvkuygk",
            imgPath: "",
            signupTime: "2019-04-09",
            deadlineTime: "2019-04-09",
            startTime: "2019-04-09",
            endTime: "2019-04-09"
          }
        ],
        focuslist: [
          {
            id: "1000",
            title: "活动一",
            description: "活动一描述",
            status: 1,
            apartmentName: "uygvkuygk",
            imgPath: "",
            signupTime: "2019-04-09",
            deadlineTime: "2019-04-09",
            startTime: "2019-04-09",
            endTime: "2019-04-09"
          },
          {
            id: "2000",
            title: "活动二",
            description: "活动二描述",
            status: 0,
            apartmentName: "uygvkuygk",
            imgPath: "",
            signupTime: "2019-04-09",
            deadlineTime: "2019-04-09",
            startTime: "2019-04-09",
            endTime: "2019-04-09"
          }
        ],
        historylist: []
      },
	  linkToApartment: "",
	  formAuth:{
		id:'',
		realName:'',
		stuNum:'',
		period: dayjs().year(),
		profession:'',		//	id
		stuClass:''		//id
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
	  validateNotice:'',
	  profession:'',
	  linkToDetail:'',
    };
  },
  created() {
	this.findAllProfession();
    this.getData();
  },
  methods: {
    async getData() {
		this.loading = true;
		let userId = this.$store.state.user.userId;
		try {
			const res = await post('/system/user/getUserData/{id}',null,userId);
			this.userData = res;
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
	checkPath(imgPath){	
    	var ImgObj = new Image();
	    ImgObj.src = imgPath;
	    if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)){
	       return imgPath;
	     } else {
	       return global_.public_img;
	    }
	},
	// 学生认证
	async findAllProfession(){
		this.loading = true;
		try {
			const res = await post('/system/dict/findAllProfession');
			this.professOptions = res;
		} catch (error) {
			this.$throw(error);
		}
		this.loading = false;
	},
	async findByProfession(){
		this.loading = true;
		if(this.formAuth.profession == ''){
			this.$Message.warning('请先选择您的专业');
			return;
		}
		try{
			const res = await post('/app/group/findByProfession/{dictId}',null,this.formAuth.profession)
	  		this.classOptions = res;
		}catch(error){
			this.$throw(error);
		}
		this.loading = false;
	},
	async submitAuth(){
		this.loading = true;
		this.$refs['formAuth'].validate((valid) => {
			if (!valid) {
				return;
			}
		})
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
.UserCard {
  word-wrap: break-word;
  margin-bottom: 20px;
  padding: 0 0 10px 5px;
}
.UserCard .userAvatar {
  color: rgb(245, 106, 0);
  background-color: rgb(253, 227, 207);
  float: left;
  margin: 24px 15px;
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 30px;
}
.UserCard .userAvatar .ivu-avatar > * {
  line-height: 60px;
}
.UserCard .title {
  padding: 20px 0px 0 10px;
  margin-left: 60px;
}
.UserCard .title .name {
  /* display: inline; */
  font-size: 21px;
  font-weight: 700;
  vertical-align: middle;
}
.UserCard .info,
.UserCard .info a {
  margin-left: 60px;
  margin-top: 10px;
  font-size: 14px;
  color: #969696;
  padding-left: 10px;
}
.info {
  color: #c3c3c3;
}
.info span {
  margin: 0 5px;
}

.info .meta-block {
  font-size: 12px;
  margin: 0 7px 6px 0;
  padding: 0 7px 0 0;
  border-right: 1px solid #f0f0f0;
  display: inline-block;
}
.info .meta-block p {
  font-size: 14px;
  text-align: center;
  font-weight: bold;
}
.memItem {
  padding: 25px 0;
  border-bottom: 1px dotted #ddd;
}
.aside {
  padding: 20px 0 0 20px;
}
.aside .title {
  /* float: left; */
  margin-bottom: 10px;
  font-size: 14px;
  color: #969696;
  padding-bottom: 20px;
  padding-top: 10px;
}
.aside .description {
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

.editIntro {
  cursor: pointer;
  color: #999;
  float: right;
  font-size: 12px;
}
.myMess {
  margin-left: 10px;
  line-height: 20px;
}

/* ********************************************************** */
.actiList .listItem {
  height: 130px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  word-wrap: break-word;
  background: #fff;
}
.actiList .listItem .ivu-card-body {
  height: 100%;
}
.actiList .col {
  height: 100%;
}
.actiList .title1 {
  margin: 20px 10px 0px;
  display: inherit;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
}
.actiList .abstract {
  margin: 5px 10px 8px;
  font-size: 13px;
  line-height: 24px;
  color: #999;
}
.actiList .meta1 {
  padding-right: 0 !important;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  position: absolute;
  bottom: 0px;
}

.actiList .meta1 span {
  margin: 0 5px;
}
.actiList .wrap-img {
  text-align: center;
  background: #000;
  width: 100%;
  height: 100%;
}
.actiList .wrap-img img {
  /*width:100%;*/
  max-height: 100%;
}
.card:hover {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    border-color: #eee;
}
.card {
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    position: relative;
    transition: all 0.2s ease-in-out;
    padding: 16px;
}
</style>
