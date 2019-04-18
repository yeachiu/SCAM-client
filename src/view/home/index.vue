<template>
  <div>
    <Row style="width:980px;margin:0 auto;">
      <Col span="16">
        <div class="listItem" v-for="item in list">
          <Col span="16" class="col"> 
            <div class="content">
              <a class="title1" target="_blank" @click="linkToDetail(item.actAbstract.id)">{{item.actAbstract.title}}</a>
              <p class="abstract">{{item.actAbstract.description}}</p>
              <div class="meta1">
                <span style="margin: 0 5px;"><Icon type="md-flame" size="14" color="#ea6f5a"/>&nbsp;{{getStateName(item.actAbstract.status,'acti')}}</span>
                <span><a class="nickname" target="_blank" @click="linkToApartment(item.actAbstract.apartment.id)">{{item.actAbstract.apartment.name}}</a></span>    
                <span v-if="item.status>2" title="活动时间"><Icon type="md-time" size="16"/>&nbsp;{{item.actAbstract.startTime}} - {{item.actAbstract.endTime}}</span>
                <span v-else title="报名时间"><Icon type="md-alarm" size="16"/>&nbsp;{{item.actAbstract.signupTime}} - {{item.actAbstract.deadlineTime}}</span>      
              </div>
            </div>
          </Col>
          <Col span="8" class="col">
            <a class="wrap-img" @click="linkToDetail(item.actAbstract.id)" target="_self">
              <img class="img-blur-done" v-bind:src="item.actAbstract.imgPath" alt="120">
            </a>
          </Col>
        </div>
      </Col>
      <Col span="8" class="aside">
        
      </Col>
    </Row>     
    
  </div>
</template>
<script>
import global_  from  '@/view/global.vue'
import dayjs from "dayjs";
import { post } from "@/libs/axios-cfg";
export default {
  data(){
    return{
      list:[
        {
          actAbstract:{
            id:'11110',
            title:'活动标题',
            description:'这是一段此次活动的简要描述',
            signupTime: "2019-04-09",
            deadlineTime: "2019-04-09",
            startTime: "2019-04-09",
            endTime: "2019-04-09",
            status:2,
            apartment:{id:'123334',name:'数学系网络技术部'},
            imgPath:'https://file.iviewui.com/dist/2ecd3b0452aa197097d5131afacab7b8.png',  // /upload/upload_images/imgId.jsp?imageformat/w/#/h/#
          }
        },
        {
          actAbstract:{
            id:'11110',
            title:'活动标题',
            description:'这是一段此次活动的简要描述',
            signupTime: "2019-04-09",
            deadlineTime: "2019-04-09",
            startTime: "2019-04-09",
            endTime: "2019-04-09",
            status:2,
            apartment:{id:'123334',name:'数学系网络技术部'},
            imgPath:'https://file.iviewui.com/dist/2ecd3b0452aa197097d5131afacab7b8.png',  // /upload/upload_images/imgId.jsp?imageformat/w/#/h/#
          }
        },
        {
          actAbstract:{
            id:'11110',
            title:'活动标题',
            description:'这是一段此次活动的简要描述',
            signupTime: "2019-04-09",
            deadlineTime: "2019-04-09",
            startTime: "2019-04-09",
            endTime: "2019-04-09",
            status:2,
            apartment:{id:'123334',name:'数学系网络技术部'},
            imgPath:'https://file.iviewui.com/dist/2ecd3b0452aa197097d5131afacab7b8.png',  // /upload/upload_images/imgId.jsp?imageformat/w/#/h/#
          }
        }
      ],
      
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      // try {
      //   const res = await post('/system/user/getUserData/{id}',null,userId);
      //   this.userData = res;
      // } catch (error) {
      //   this.$throw(error);
      // }
      this.loading = false;
    },
    linkToDetail(actiId){
      this.$router.push({
        path: `detail/${actiId}`,
      })
    },
    linkToApartment(apartId){
      // this.$router.push({
      //   path: `/apartment/${actiId}`,
      // })
      alert("功能开发中…");
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
  },
    }
</script>
<style>
  .listItem {
    height: 200px;
    margin: 0 0 15px;
    border-bottom: 1px solid #f0f0f0;
    word-wrap: break-word;
    background: #fff;
}
  .listItem .ivu-card-body {
    height: 100%;
  }
  .col {
    height:100%;
  }
  .title1 {
    margin: 20px 10px 0px;
    display: inherit;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
  }
  .abstract {
    margin: 5px 10px 8px;
    font-size: 13px;
    line-height: 24px;
    color: #999;
  }
  .meta1 {
    padding-right: 0!important;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    position: absolute;
    bottom: 10px;
  }
  .meta1 span {
     margin: 0 5px;
  }
  .wrap-img {
    /*width:80%;*/
  }
  .wrap-img img {
    /*width:100%;*/
    max-height:100%;
  }
</style>