<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>活动管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15">
                            <!-- <Button type="info" to="./add"><Icon type="md-add"></Icon>&nbsp;创建活动</Button> -->
                            <Button type="info" @click="openAddModal"><Icon type="md-add"></Icon>&nbsp;创建活动</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
                        </Col>
                        <Col span="9">
                            <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                                <Button slot="append" icon="ios-search"></Button>
                            </Input>
                        </Col>
                    </Row>
                    <Table ref="table"  class="margin-bottom-10"
                         :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="data.records"></Table>
                    <Page :total="data.total" class="tr" @on-change="pageChange" :current.sync="data.current" :page-size="data.size"
                      @on-page-size-change="pageSizeChange" show-elevator show-sizer></Page>
                </template>
            </div>
        </Card>
        <!-- <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="setting.loading" @click="removeUser">确认删除</Button>
            </div>
        </Modal> -->
        <AddActivity v-if="addActivityModal" @cancel="onModalCancel"/>
        <UpdateActivity v-if="updateActivityModal" :roles="roles" :uid="updateUserId" @cancel="onModalCancel"/>
      
    </div>
</template>
<script> 
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    import AddActivity from './components/add.vue'
    import UpdateActivity from './components/update.vue'
    /** 活动状态 **/
    let ACT_STATUS_DRAFT = 1;   //草稿
    let ACT_STATUS_PUBLISH = 2;   //已发布
    let ACT_STATUS_PROCESS = 3;   //进行中
    let ACT_STATUS_COMPLETE = 4;   //已结束
    let ACT_STATUS_CANCEL = 0;  //已取消
    export default {
      data () {
        return {
          addActivityModal:false,
          updateActivityModal:false,
          updateId:null,
          selections:[],
          removeModal:false,
          setting:{
            loading:true,
            showBorder:true
          },
          search:{
            type:'title',
            value:''
          },
          columns: [
            {title: '活动名称', key: 'title',sortable: true},
            {
              title: '状态',
              key: 'status', 
              render:(h,params)=>{
                let value;
                switch ( params.row.status){
                  case ACT_STATUS_PUBLISH : value = '已发布';break;
                  case ACT_STATUS_PROCESS : value = '进行中';break;
                  case ACT_STATUS_COMPLETE : value = '已结束';break;
                  case ACT_STATUS_CANCEL : value = '已取消';break;
                  case ACT_STATUS_DRAFT : value = '草稿';break;
                  default: value = 'error';
                }
                return h('span', value)
              },
              sortable: true
            },
            {
              title: '已参与名额',
              key: 'limitQuota', 
              render:(h,params)=>{
                return h('span',params.row.memberNow + '/' + params.row.limitQuota)
              }
            },
            {
              title: '创建日期',
              key: 'createDate',
              render:(h,params)=>{
                return h('span',dayjs(params.row.createDate).format('YYYY-MM-DD HH:mm:ss'))
              },
              sortable: true
            },
            {
              title: '操作',
              key: 'action',
              width: 260,
              align: 'center',
              render: (h, params) => {
                let type,value,currentStatus;
                switch ( params.row.status){
                  case ACT_STATUS_PUBLISH || ACT_STATUS_PROCESS: //已发布to草稿，to取消，to编辑
                    return h('div', [
                      h('Button', {
                        props: {type: 'primary',size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                            click:()=>{
                              this.openAddModal(params.row)
                            }
                        }
                      }, '编辑'),
                      h('Button', {
                        props: {type: 'warning' ,size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                            click:()=>{
                              this.changeStatus(params.row,ACT_STATUS_CANCEL)
                            }
                        }
                      },'取消'),
                    ]);
                    break;
                  case ACT_STATUS_DRAFT : //草稿to取消，to编辑,to发布
                    return h('div', [
                      h('Button', {
                        props: {type: 'primary' ,size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                            click:()=>{
                              this.changeStatus(params.row,ACT_STATUS_PUBLISH)
                            }
                        }
                      },'发布'),
                      h('Button', {
                        props: {type: 'primary',size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                            click:()=>{
                              this.openAddModal(params.row)
                            }
                        }
                      }, '编辑'),
                      h('Button', {
                        props: {type: 'warning' ,size: 'small'},
                        style: {marginRight: '5px'},
                        on:{
                            click:()=>{
                              this.changeStatus(params.row,ACT_STATUS_CANCEL)
                            }
                        }
                      },'取消')
                    ]);
                    break;
                  default: return;
                }
              }
            }
          ],
          // data: {},
          data:{
            records:[
              {
                title:'活动一',status:1,memberNow:13,limitQuota:37,createDate:'Wed Mar 06 2019 00:00:00 GMT+0800 (中国标准时间)'
              },
              {
                title:'活动二',status:2,memberNow:13,limitQuota:37,createDate:'Wed Mar 06 2019 00:00:00 GMT+0800 (中国标准时间)'
              }
            ],

          },
          dataFilter:{
            page:1,
            pageSize:15 
          },
          removeObject:null,
          roles:null
        }
      },
      components:{
        AddActivity,UpdateActivity
      },
      created(){
        this.getData();
      },
      methods:{
        /**
         * @description 分页更换事件回调
         */
        pageChange(p){
          this.dataFilter.page = p;
          this.getData();
        },
        /**
         * @description 分页每页显示数量改变事件回调
         */
        pageSizeChange(p){
          this.dataFilter.pageSize = p;
          this.getData();
        },
        /**
         * @description 修改状态！！！
         * ->cancel
         * ->publish
         * ->
         */
        async changeStatus(obj,currentStatus){
          this.setting.loading = true;
          let req_msg = currentStatus==ACT_STATUS_CANCEL ? '已取消' : '已发布';
          try {
            let res = await post('/app/activity/statusChange/{uid}/{status}',{
              uid: obj.id,
              status: currentStatus
            })
            this.$Message.destroy();
            this.$Message.success(req_msg);
            if(currentStatus == ACT_STATUS_CANCEL){
              // this.data.records.splice(this.removeObject.index,1);
            }else{//currentStatus == ACT_STATUS_PUBLISH
              obj.status = ACT_STATUS_PUBLISH;
            }
          } catch (error) {
            this.$throw(error)
          }
          this.setting.loading = false;
        },
        /**
         * @description 获取活动列表
         */
        async getData(){
            this.setting.loading = true;
            //接口暂未开放 ……&*
            // try {
            //   let res = await post('/app/activity/list',{
            //     page:this.dataFilter.page,
            //     pageSize:this.dataFilter.pageSize
            //   })
            //   this.data = res.data;
            // } catch (error) {
            //   this.$throw(error)
            // }
            this.setting.loading = false;
        },
        /**
         * @description 获取回收站列表
         */
        async getCancelList(){
            try {
              let res = await post('/app/activity/list/cancel',{
                page:1,
                pageSize:1000
              })
              this.data = res.data;
            } catch (error) {
              this.$throw(error)
            }
        },
          /**
         * @description 打开模态窗口
         * @param uid 用户ID
         * @param type 打开类型
         */
        openAddModal(actiId){
            if(actiId==null){
              this.addActivityModal = true;
            }else {
              this.updateId = actiId;
              this.updateActivityModal = true;
            }
        },
        /**
         * @description 关闭模态窗口
         * @param type 窗口类型
         * @param reload 是否重新加载数据
         */
        onModalCancel(type,reload = false){
          switch(type){
            case 'add':{
              this.addUserModal = false;
            };break;
            case 'update':{
              this.updateUserModal = false;
            };break;
            case 'resetPassword':{
              this.resetPasswordModal = false;
            };break;
          }
          if(reload) this.getData();
        },
        /**
         * @description 导出表格CSV
         */
        exportData(type){
          if (type === 1) {
            this.$refs.table.exportCsv({
              filename: '用户数据-'+new Date().getTime(),
              columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
              data: this.data
            });
          }
        }
      }
    }
</script>