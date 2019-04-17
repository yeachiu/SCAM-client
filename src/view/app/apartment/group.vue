<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>分组管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15">
                            <Button type="info" @click="openAddOrUpModal(null)"><Icon type="md-add"></Icon>&nbsp;添加分组</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Button type="primary" @click="exportData(1)"><Icon type="ios-download-outline"></Icon>&nbsp;导出表格</Button>
                        </Col>
                        <Col span="9">
                            <Input v-model="search.value" placeholder="请输入您想要搜索的内容..." class="margin-bottom-10">
                                <Button slot="append" icon="ios-search"></Button>
                            </Input>
                        </Col>
                    </Row>
                    <Table  ref="table"  class="margin-bottom-10" :columns="columns" 
                        :loading="setting.loading"  :border="setting.showBorder" :data="data"></Table>
                </template>
            </div>
        </Card>
        <AddGroup v-if="addGroupModal" :allMember="allMember" :add-Id="apartmentId" @cancel="onAddGroupModalCancel"/>
        <UpdateGroup v-if="updateGroupModal" :allMember="allMember" :update-object="updateObject" @cancel="onUpdateGroupModalCancel"/>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="setting.loading" @click="remove">确认删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import AddGroup from './components/addGroup.vue'
    import UpdateGroup from './components/updateGroup.vue'
    import { post } from '@/libs/axios-cfg'
    export default {
        data () {
            return {
              apartmentId:'',
              addGroupModal:false,
              updateGroupModal:false,
              updateObject:null,
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
                  {title: '小组名', key: 'name',sortable: true},
                  {
                      title: '操作',
                      key: 'action',
                      width: 260,
                      align: 'center',
                      render: (h, params) => {
                          return h('div', [
                              h('Button', {
                                  props: {type: 'success',size: 'small'},
                                  style: {marginRight: '5px'},
                                  on:{
                                      click:()=>{
                                          this.showAllMember(params.row)
                                      }
                                  }
                              }, '查看组成员'),
                              h('Button', {
                                  props: {type: 'primary',size: 'small'},
                                  style: {marginRight: '5px'},
                                  on:{
                                      click:()=>{
                                          this.openAddOrUpModal(params.row)
                                      }
                                  }
                              }, '修改信息'),
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
                  id:'01001',
                  name:'1号小组',
                  members:[
                    {
                      uid:'111111',
                      realName:'科别拉'
                    },
                    {
                      uid:'111365',
                      realName:'系统管理员'
                    }
                  ]
                },
              ],
              dataFilter:{
                  page:1,
                  pageSize:10
              },
              removeObject:null,
              allMember:null
            }
        },
        components: {
            AddGroup,UpdateGroup
        },
        created(){
            this.getData();
        },
        methods:{
            pageChange(p){
                this.dataFilter.page = p;
                this.getData();
            },
            pageSizeChange(p){
                this.dataFilter.pageSize = p;
                this.getData();
            },
            async getAllMember(){
                // try {
                //     let res = await post('/app/apartment/member/list/{id}',null,{
                //       id:this.apartmentId
                //     })
                //     this.allMember = res.data;
                // } catch (error) {
                //     this.$throw(error)
                // }
                this.allMember = [
                  {
                    uid:'111111',
                    realName:'科别拉'
                  },
                  {
                    uid:'111365',
                    realName:'系统管理员'
                  }
                ]
            },
            async remove(){
                this.removeModal = false;
                if(this.removeObject==null){
                    this.$Message.warning("删除对象为空，无法继续执行！");
                    return false;
                }
                this.setting.loading = true;
                try {
                    let res = await post('/app/apartment/member/remove/{uid}',null,{
                        uid: this.removeObject.obj.id
                    })
                   this.$Message.success("删除成功");
                    this.data.splice(this.removeObject.index,1);
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            async getData(){
                this.setting.loading = true;
                //接口暂未开放 ……&*
                // try {
                //     let res = await post('/app/apartment/group/list/{id}',null,{
                //         id:this.apartmentId
                //     })
                //     this.data = res.data;
                // } catch (error) {
                //     this.$throw(error)
                // }
                this.setting.loading = false;
            },
            async openAddOrUpModal(obj,type = 'update'){
                if(this.allMember===null){
                   await this.getAllMember();
                }
                if(obj===null){
                    this.addGroupModal = true;
                }else if(type==='update'){
                    this.updateObject = obj;
                    this.updateGroupModal = true;
                }
            },
            onAddGroupModalCancel(up=false){
                this.addGroupModal = false;
                if(up) this.getData()
            },
            onUpdateGroupModalCancel(up=false){
                this.updateGroupModal = false;
                if(up) this.getData()
            },
            dealPostData(data, ps, h){
                if(data!=null){
                    data.forEach(element => {
                        let r = h('Tag',{
                            props:{
                                color:'green',
                                type:'dot'
                            }
                        },element.name);
                        ps.push(r);
                        if(element.children!=null){
                            this.dealPostData(element.children, ps, h)
                        }
                    });
                }
                
            },
            showAllMember(row){
                let members = row.members;
                if(members!=null && typeof(members)=="object" && members.length > 0){
                    this.$Modal.info({
                        title: row.name+' - 组成员',
                        width:'40%',
                        render: (h)=>{
                            let ps = [];
                            members.forEach(element => {
                                let r = h('Tag',{
                                    props:{
                                        color:element.color=='' ? 'green' : element.color,
                                        type:'dot',
                                    }
                                },element.realName);
                                ps.push(r);
                                this.dealPostData(element.children,ps, h)
                            });
                            return h('div',{
                                style:{padding:'20px 0 10px 0'}
                            },ps);
                        }
                    });
                }else{
                    this.$Notice.destroy()
                    this.$Notice.info({
                        title:"该分组暂无成员",
                        duration:3
                    })
                }
            },
            exportData(type){
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '组成员数据-'+new Date().getTime(),
                        columns: this.columns.filter((col, index) => index > 1 && index < this.columns.length-1),
                        data: this.data
                    });
                }
            }
        }
    }
</script>