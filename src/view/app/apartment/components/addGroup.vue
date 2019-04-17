<template>
  <div>
      <!-- 添加小组  -->
        <Modal v-model="showModal" title="小组添加" :loading="loading" :mask-closable="false" :width="800" :closable="false">
            <Form ref="addGroup" :model="formItem" :label-width="90" :rules="ruleValidate">
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
              members: [],
              apartmentId:this.addId
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
        allMember:{
            type:Array
        },
        addId:String
    },
    created(){
      if(this.updateObject!=null){
        this.formItem.name = this.updateObject.name;
        this.updateObject.members.forEach(element => {
          this.formItem.members.push(element.uid);
        });
      }
      console.info(allMember);
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
        let memList = this.checkedNodes;
        this.$refs.addGroup.validate((valid) => {
            if (valid) {
                if(memList.length<1){
                    this.$Notice.destroy();
                    this.$Notice.warning({
                        title: '请至少选择一个成员',
                        duration: 2
                    });
                }else{
                    let postObj = {
                        name:this.formItem.name,
                        members:memList
                    }
                    this.add(postObj)
                }
            }
        })
      },
      async add(data){
        this.loading = true;
        try {
            let res = await post('/apartment/group/add',data)
            this.$Message.success("小组 "+data.name+" 创建成功");
            this.cancel(true);
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
      }
  }
}
</script>

