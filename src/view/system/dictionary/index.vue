<template>
    <div>
        <Card>
            <p slot="title" class="card-title">
                <Icon type="home"></Icon>
                <span>字典管理</span>
            </p>
            <div>
                <template>
                    <Row>
                        <Col span="15"  class="margin-bottom-10">
                            <Button type="info" @click="openAddModal(null)"><Icon type="md-add"></Icon>&nbsp;添加字典</Button>
                            <Button :disabled="setting.loading" type="success" @click="getData"><Icon type="md-refresh"></Icon>&nbsp;刷新数据</Button>
                            <Tooltip placement="top">
                                <i-switch size="large" v-model="props.isFold">
                                    <span slot="open">开启</span>
                                    <span slot="close">关闭</span>
                                </i-switch>
                                <div slot="content">
                                    <p>是否折叠所有的节点</p>
                                </div>
                            </Tooltip>
                        </Col>
                    </Row>
                    <zk-table
                        ref="table"
                        sum-text="sum"
                        index-text="#"
                        size="small"
                        :data="datas"
                        :columns="columns"
                        :stripe="props.stripe"
                        :border="props.border"
                        :show-header="props.showHeader"
                        :show-summary="props.showSummary"
                        :show-row-hover="props.showRowHover"
                        :show-index="props.showIndex"
                        :tree-type="props.treeType"
                        :is-fold="props.isFold"
                        :expand-type="props.expandType"
                        :selection-type="props.selectionType">
                        <template slot="action" slot-scope="scope">
                            <Button type="primary" @click="edit(scope.row)" size="small">编辑</Button>
                            <Button type="success" @click="openAddModal(scope.row)" size="small">添加下级</Button>
                            <Button type="error" @click="removeModalOpen(scope.row.id)" size="small">删除</Button>
                        </template>
                    </zk-table>
                </template>
            </div>
        </Card>
        <Modal v-model="modal.show" :title="modal.type==1 ? '添加字典':'更新字典'"
             @on-ok="modalOk"
             :mask-closable="false">
            <Form :model="modal.data" :label-width="80">
                <FormItem v-if="modal.type==2" label="ID">
                    <Input disabled :value="modal.data.id"></Input>
                </FormItem>
                <FormItem v-if="modal.type==1 && modal.data.parentName!=null" label="父级名称">
                    <Input disabled :value="modal.data.parentName"></Input>
                </FormItem>
                <FormItem label="名称">
                    <Input v-model.trim="modal.data.dictName"></Input>
                </FormItem>
                <FormItem label="代码">
                    <Input v-model.trim="modal.data.dictCode"></Input>
                </FormItem>
                <FormItem label="排序">
                    <InputNumber  :min="0" :step="1" v-model.trim="modal.data.sort" style="width:100%"/>
                </FormItem>
                <FormItem label="备注">
                    <Input v-model.trim="modal.data.remark"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="removeModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center">
                <p>此操作为不可逆操作，是否确认删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="remove">确认删除</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { post } from '@/libs/axios-cfg'
    export default {
        data () {
            return {
                removeModal:false,
                setting:{
                    loading:true,
                    showBorder:true
                },
                props: {
                    stripe: true,
                    border: true,
                    showHeader: true,
                    showSummary: false,
                    showRowHover: true,
                    showIndex: false,
                    treeType: true,
                    isFold: false,
                    expandType: false,
                    selectionType: false,
                },
                datas: [],
                columns: [
                    {
                        label: '字典名称',
                        prop: 'dictName'
                    },
                    {
                        label: '代码',
                        prop: 'dictCode',
                        width:'80px'
                    },
                    {
                        label: '排序',
                        prop: 'sort',
                        width:'100px'
                    },
                    {
                        label: '备注',
                        prop: 'remark',
                        width:'100px'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        prop: 'action',
                        template: 'action',
                        width:'190px'
                    }
                ],
                modal:{
                    show:false,
                    type:1,
                    data:{
                        id:'',
                        dictName:'',
                        dictCode:'',
                        sort:0,
                        remark:''
                    }
                },
                removeObject:null
            }
        },
        created(){
            this.getData();
        },
        methods:{
            async getData(){
                this.setting.loading = true;
                try {
                    let res = await post('/system/dictionary/list')
                    this.datas = res.data;
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
            },
            async addOK(){
                this.$Message.loading({
                    content:"字典添加中...",
                    duration:0
                })
                try {
                    await post('/system/dictionary/add',this.modal.data)
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"字典添加成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
            },
            async editOk(){
                this.$Message.loading({
                    content:"资源更新中...",
                    duration:0
                })
                try {
                    await post('/system/dictionary/update/{id}',this.modal.data,{
                        id:this.modal.data.id
                    })
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"资源更新成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
            },
            removeModalOpen(id){
                this.removeModal = true;
                this.removeObject = id;
            },
            async remove(){
                this.setting.loading = true;
                this.$Message.loading({
                    content:"资源删除中...",
                    duration:0
                })
                try {
                    await post('/system/dictionary/remove/{id}',null,{
                        id:this.removeObject
                    })
                    this.getData(false)
                    this.$Message.destroy()
                    this.$Message.success({
                        content:"资源删除成功",
                        duration: 1.5
                    });
                } catch (error) {
                    this.$throw(error)
                }
                this.setting.loading = false;
                this.removeModal = false;
            },
            modalOk(){
                if(this.modal.type==1){
                    this.addOK();
                }else{
                    this.editOk();
                }
            },
            edit(row){
                this.modal.type = 2;
                this.modal.data = {
                    id:row.id,
                    dictName:row.dictName,
                    dictCode:row.dictCode,
                    sort:row.sort,
                    remark:row.remark
                  }
                this.modal.show = true;
            },
            openAddModal(parent=null){
                this.modal.type = 1;
                this.modal.data = {
                    id:'',
                    parentId:parent==null ? null : parent.id,
                    dictName:'',
                    dictCode:'',
                    sort:0,
                    remark:''
                }
                console.log(this.modal.data)
                this.modal.show = true;
            }
        }
    }
</script>