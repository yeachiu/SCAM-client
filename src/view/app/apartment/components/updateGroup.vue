<template>
  <div>
      <!-- 更新小组  -->
        <Modal v-model="showModal" title="更新小组" :loading="loading" :mask-closable="false" :width="800" :closable="false">
            <Form ref="updateGroup" :model="formItem" :label-width="90" :rules="ruleValidate">
                <FormItem label="小组名称：" prop="name">
                    <Input v-model="formItem.name" placeholder="小组名称"></Input>
                </FormItem>
            </Form>
            <Form  :label-width="70">
                <FormItem label="组成员：" prop="members">
                  <CheckboxGroup v-model="formItem.members" @on-change="getCheckedNodes">
                    <Checkbox v-for="(item,key) in allMember" :key="key" :label="item.uid" >
                      <span>{{item.realName}}</span>
                    </Checkbox>                     
                  </CheckboxGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" :disabled="loading" @click="cancel(false)">取消</Button>
                <Button type="primary" :loading="loading" @click="ok">确定</Button>
            </div>
        </Modal>
  </div>
</template>
<script>
import { post } from '@/libs/axios-cfg'
export default {
  data(){
    return {
      formItem: {
        name:'',
        members: []
      },
      checkedNodes: [],
      showModal:true,
      loading: false,
      ruleValidate:{
        name:[
          { required: true, message: '小组名称不能为空'}
        ]
      }
    }
  },
  props:{
    updateObject:{
      type:Object,
      default:null
    },
    allMember:{
      type:Array
    }
  },
  created(){
    if(this.updateObject!=null){
        this.formItem.name = this.updateObject.name;
        this.updateObject.members.forEach(element => {
          this.formItem.members.push(element.uid);
        });
    }
  },
  methods:{
      cancel(up=false){
          this.$emit('cancel',up);
      },
      getCheckedNodes(uids){
        uids.forEach(uid =>{
          this.allMember.forEach(item =>{
            if(item.uid == uid){
              this.checkedNodes.push(item);
            }
          })
        });
      },
      ok(){
        let memlist = this.checkedNodes;
        this.$refs.updateGroup.validate((valid) => {
            if (valid) {
                if(memlist.length<1){
                    this.$Notice.destroy();
                    this.$Notice.warning({
                        title: '请至少选择一个成员',
                        duration: 2
                    });
                }else{
                    let postObj = {
                        name:this.formItem.name,
                        members:memlist
                    }
                    console.info(postObj);
                    this.update(postObj)
                }
            }
        })
      },
      async update(data){
        this.loading = true;
        try {
            let res = await post('/apartment/group/update/{id}',data,{
                id:this.updateObject.id
            })
            this.$Message.success("小组 "+data.name+" 更新成功");
            this.cancel(true);
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
      }
  }
}
</script>

