<template>
</template>
<script type="text/javascript">
import public_img from '@/assets/images/img.png'
/** 活动状态 **/
const actiStatus = [
  { state: 0,type:'已取消'},//
  { state: 1,type:'未发布'},//
  { state: 2,type:'报名中'},//已发布未开报名，已发布开报名，已报名
  { state: 3,type:'进行中'},
  { state: 4,type:'已结束'},
];
/** 认证状态 **/ 
const authStatus = [
  { state: 0,type:'认证中'},
  { state: 1,type:'已认证'},
];
function getStateName (state, arr) {

  for(var i = 0;i<arr.length;i++){
    if(arr[i].state === state){
      return arr[i].type
    }
  }
}
export default{
  public_img ,
  actiStatus ,
  authStatus ,
  getStateName
}
</script>
<style>
</style>