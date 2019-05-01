<template>
  <div>
    <Row style="width:980px;margin:0 auto;">
      <Col span="16">
        <div class="listItem" v-for="item in list" :key="item.id">
          <Col span="16" class="col"> 
            <div class="content">
              <a class="title1" target="_blank" @click="linkToDetail(item.id)">{{item.title}}</a>
              <p class="abstract">{{item.description}}</p>
              <div class="meta1">
                <span style="margin: 0 5px;"><Icon type="md-flame" size="14" color="#ea6f5a"/>&nbsp;{{getStateName(item.status,'acti')}}</span>
                <span><a class="nickname" target="_blank" @click="linkToApartment(item.organizerId)">{{item.organizerName}}</a></span>    
                <span title="活动时间" v-if="item.status > 2"><Icon type="md-time" size="16"/>&nbsp;{{dateformat(item.startTime)}} - {{dateformat(item.endTime)}}</span>
                <span title="报名时间" v-else><Icon type="md-alarm" size="16"/>&nbsp;{{dateformat(item.signupTime)}} - {{dateformat(item.deadlineTime)}}</span>      
              </div>
            </div>
          </Col>
          <Col span="8" class="col wrap-img" >
            <a @click="linkToDetail(item.id)" target="_self">
              <img v-bind:src="item.pictureUrl" alt="活动配图" v-if="checkPath(item.pictureUrl)"/>
              <img v-bind:src="global_.public_img" alt="活动配图" v-else>
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
      loading:false,
      list:[],
    }
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      try {
        let res = await post('/app/activity/get/list');
        this.list = res.data;
      } catch (error) {
        this.$throw(error);
      }
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
    width: 200px;
    height: 200px;
    overflow: hidden;
    padding: 40px 0 20px;
  }
  .wrap-img img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
    position: absolute;
    bottom: 20px;
  }
</style>