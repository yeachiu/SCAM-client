<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>成员管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15">
                            <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加成员</Button>
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
                         :columns="columns" :loading="setting.loading"  :border="setting.showBorder" :data="data"></Table>
                </template>
            </div>
        </Card>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="setting.loading" @click="removeMember">确认删除</Button>
            </div>
        </Modal>
        <AddMember v-if="addMemberModal" :roles="roles" @cancel="onModalCancel"/>
        <UpdateMember v-if="updateMemberModal" :roles="roles" :uid="updateMemberId" @cancel="onModalCancel"/>
    </div>
</template>
<script>
    import dayjs from 'dayjs'
    import { post } from '@/libs/axios-cfg'
    import AddMember from './components/add.vue'
    import UpdateMember from './components/update.vue'
    export default {
        data () {
            return {
                addMemberModal:false,
                updateMemberModal:false,
                updateMemberId:null,
                // selections:[],
                apartmentId:null,
                removeModal:false,
                setting:{
                    loading:true,
                    showBorder:true
                },
                search:{
                    type:'name',
                    value:''
                },
                columns: [
                    {title: 'ID', key: 'id',sortable: true},
                    {title: '姓名', key: 'realName',sortable: true},
                    {title: '班级',key: 'whatClass',sortable: true},
                    {
                        title: '跟进的活动',
                        key: 'activities', 
                        render:(h,params)=>{
                            let activities = []
                            if(params.row.activities!=null && params.row.activities.length>0){
                                params.row.activities.forEach(element => {
                                    let acti = h('Tag',{
                                        props:{
                                            color:"blue"
                                        }
                                    },element.title)
                                    activities.push(acti)
                                });
                                return h('div',activities)
                            }
                            return h('span','空')
                        }
                    },
                    {
                        title: '加入日期',
                        key: 'createDate',
                        render:(h,params)=>{
                            return h('span',dayjs(params.row.createDate).format('YYYY年MM月DD日 HH:mm:ss'))
                        },
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 260,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary',size: 'small'},
                                    style: {marginRight: '5px'},
                                    on:{
                                        click:()=>{
                                            this.openAddModal(params.row.id)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {type: 'error',size: 'small'},
                                    on:{
                                        click:()=>{
                                            this.removeObject = {
                                                obj:params.row,
                                                index:params.index
                                            }
                                            this.removeModal = true;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data: [
                  {
                    id:'111111',
                    realName:'科别拉',
                    whatClass:'15信管1班',
                    activities:[
                      {
                        id:'00100',
                        title:'地球一小时'
                      },
                      {
                        id:'00200',
                        title:'活动一'
                      }
                    ],
                    createDate:'2019-02-23 09:03:37'
                  },
                  {
                    id:'111365',
                    realName:'系统管理员',
                    whatClass:'15信管1班',
                    activities:[
                      {
                        id:'00100',
                        title:'地球一小时'
                      },
                      {
                        id:'00200',
                        title:'活动一'
                      }
                    ],
                    createDate:'2019-01-03 19:03:37'
                  },
                ],
                dataFilter:{
                    page:1,
                    pageSize:10
                },
                removeObject:null,
                roles:null
            }
        },
        components:{
            AddMember,UpdateMember
        },
        created(){
            this.getData();
        },
        methods:{
             /**
             * @description 删除成员
             */
            async removeMember(){
                this.removeModal = false;
                if(this.removeObject==null){
                    this.$Message.warning("删除对象为空，无法继续执行！");
                    return false;
                }
                this.setting.loading = true;
                try {
                    let res = await post('/app/apartment/removeMember/{uid}',null,{
                        uid: this.removeObject.obj.id
                    })
                    this.$Message.success("删除成功");
                    this.data.splice(this.removeObject.index,1);
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            /**
             * @description 获取成员列表
             */
            async getData(){
                this.setting.loading = true;
                //接口尚未开放 ……&*
                // try {
                //     let res = await post('/app/apartment/member/list/{id}',null,{
                //         id:this.apartmentId
                //     })
                //     this.data = res.data;
                // } catch (error) {
                //     this.$throw(error)
                // }
                this.setting.loading = false;
            },
            /**
             * @description 获取参与活动列表
             */
            async getActivityList(){
                try {
                    let res = await post('/app/activity/list',{                 
                    })
                    this.activities = res.data;
                } catch (error) {
                    this.$throw(error)
                }
            },
             /**
             * @description 打开模态窗口
             * @param uid 成员ID
             * @param type 打开类型
             */
            openAddModal(uid){
              if(uid==null || type==='update'){
                if(this.activities == null){
                  this.getActivityList();
                }
              }  
              this.updateMemberId = uid;
              this.updateMemberModal = true;                
            },
            /**
             * @description 关闭模态窗口
             * @param type 窗口类型
             * @param reload 是否重新加载数据
             */
            onModalCancel(reload = false){
                this.updateMemberModal = false;
                if(reload) this.getData();
            },
            /**
             * @description 导出表格CSV
             */
            exportData(type){
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '成员数据-'+new Date().getTime(),
                        columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
                        data: this.data
                    });
                }
            }
        }
    }
</script>