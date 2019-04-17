<template>
  <div>
    <Modal v-model="show" title="活动开放对象"
            :mask-closable="false" :closable="false">
        <Tree ref="tree" :data="datas" show-checkbox></Tree>
        <div slot="footer">
            <Button type="default" :disabled="loading" @click="cancel">取消</Button>
            <Button type="primary" :loading="loading" @click="ok">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>
import { post } from '@/libs/axios-cfg'
export default {
  data() {
    return {
      show:true,
      loading: false,
      datas: [
              {
                  title: 'parent 1',
                  expand: true,
                  selected: false,
                  children: [
                      {
                          title: 'parent 1-1',
                          selected: false,
                          children: [
                              {
                                  title: 'leaf 1-1-1',
                                  selected: false,
                              },
                              {
                                  title: 'leaf 1-1-2',
                                  selected: false,
                              }
                          ]
                      },
                      {
                          title: 'parent 1-2',
                          children: [
                              {
                                  title: 'leaf 1-2-1',
                                  selected: false,
                              },
                              {
                                  title: 'leaf 1-2-2',
                                  selected: false,
                              }
                          ]
                      }
                  ]
              },
              {
                title:'部门分组',
                expand: true,
                children:[
                    {
                        id:'123456',
                        title:'group01',
                    },
                    {
                        id:'223456',
                        title:'group02'
                    },
                    {
                        id:'323456',
                        title:'group03'
                    }
                ]
              }
            ],
      checkedNodes: []
    };
  },
  props: {
    apartmentId:String,
    checkeds:Array
  },
  created(){
    // this.getData();
    let checkeds = this.checkeds;
    this.checkedNodeSync(checkeds,this.datas)
        
  },
  methods: {
    async getdata(){
        this.loading = true;
        try {
          /**
           * 接口测试用数据
           */
          this.apartmentId = 'abcdefg';
          let res = await post('/app/apartment/group/list/{id}',null,{
              id: this.apartmentId
          })
          this.datas = res.data;
        } catch (error) {
          this.$throw(error)
        }
        this.loading = false;
    },
    checkedNodeSync(checkeds,datas){
        if(checkeds!=null && checkeds.length>0){      
            datas.forEach(r => {
                checkeds.forEach(c => {
                    if(c.title== r.title){
                        r.checked = true;
                    }
                });
                if(r.children!=null && r.children.length>0){
                    this.checkedNodeSync(checkeds,r.children)
                }
            });        
        }
      },
    /**
     * @description 关闭Modal
     */
    cancel() {
      this.$emit("cancel", false);
    },
    /**
     * @description 确定按钮单击回调
     */
    ok() {
      let nodes = this.$refs.tree.getCheckedNodes();
      console.info(nodes);
      this.$emit('checkedNodes',nodes);
      this.$emit("cancel",false );
    },
    /**
     * @description 添加分组数据请求
     */
    async add(data){
        this.loading = true;
        try {
            let res = await post('/system/user/add',data)
            this.$Message.success("用户 "+data.username+" 添加成功");
            this.cancel(true)
        } catch (error) {
            this.$throw(error)
        }
        this.loading = false;
    },
    mounted () {
      this.checkedNodes = this.$refs.tree.getCheckedNodes();
    },
  }
};
</script>
