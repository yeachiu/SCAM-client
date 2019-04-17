<template>
    <div>
        <Table :columns="columns" :data="data">
            <template slot-scope="{ row, index }" slot="awardName">
                <Input type="text" v-model="editName" v-if="editIndex === index && index != 0" />
                <span v-else>{{ row.awardName }}</span>
            </template>

            <template slot-scope="{ row, index }" slot="awardNum">
                <InputNumber :min="1" type="text" v-model="editNum"  v-if="editIndex === index && index != 0" />
                <span v-else>{{ ifBlank(row.awardNum) }}</span>
            </template>

            <template slot-scope="{ row, index }" slot="awardScore">
                <InputNumber :min="0" :step="0.5" v-model="editScore" v-if="editIndex === index" />
                <span v-else>{{ row.awardScore }}</span>
            </template>

            <template slot-scope="{ row, index }" slot="action">
                <div v-if="editIndex === index">
                <Button @click="handleSave(index)">保存</Button>
                <Button @click="cancel">取消</Button>
                </div>
                <div v-else>
                <ButtonGroup shape="circle">
                    <Button @click="handleEdit(row, index)">操作</Button>
                    <Button @click="handleRemove(index)" v-if="index != 0">删除</Button>
                </ButtonGroup>
                </div>
            </template>
        </Table>
        <Button icon="ios-add" type="dashed" @click="handleAdd" class="handleAdd">添加</Button>
    </div> 
</template>
<script>
  export default {
    data () {
      return {
        columns: [
          {
            title: '奖项名',
            slot: 'awardName'
          },
          {
            title: '名额',
            slot: 'awardNum'
          },
          {
            title: '学分',
            slot: 'awardScore'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        data: [
          {
            awardName: '参与成功',
            awardNum: '',
            awardScore: 1
          },
          {
            awardName: '一等奖',
            awardNum: 1,
            awardScore: 6
          },
          {
            awardName: '二等奖',
            awardNum: 2,
            awardScore: 4
          },
          {
            awardName: '三等奖',
            awardNum: 3,
            awardScore: 2
          },
        ],
        editIndex: -1,  // 当前聚焦的输入框的行数
        editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
        editNum: '',  // 第二列输入框
        editScore: '',  // 第三列输入框
      }
    },
    methods: {
      handleAdd(){
        let addItem = {
            awardName: '',
            awardNum: 1 ,
            awardScore: 1
          };
        this.data.push(addItem);
        let index = this.data.length - 1;
        this.handleEdit(addItem,index);
      },
      handleEdit (row, index) {
        this.editName = row.awardName;
        this.editNum = row.awardNum;
        this.editScore = row.awardScore;
        this.editIndex = index;
      },
      handleSave (index) {
        if(this.editName == ''){
          this.$Message.error({
            content: '奖项名称不能为空喔！',
            duration: 3
          });
          return;
        }
        this.data[index].awardName = this.editName;
        this.data[index].awardNum = this.editNum;
        this.data[index].awardScore = this.editScore;
        this.editIndex = -1;
      },
      handleRemove(index) {
        this.data.splice(index,1);
      },
      cancel(){
        if(this.editName == ''){
          this.handleRemove(this.data.length - 1);
          return;
        }
        this.editIndex = -1;
      },
      ifBlank(num){
        if(num == ''){  return '--';   }
        return num;
      }
    },
    mounted(){
      this.$on("submitScoreData",() => {
          console.log("老爹，score知道啦");
          this.$emit("submitData",this.data);
      })
    }
  }
</script>
<style>
  .handleAdd {
    width: 100%;
    border-radius: 0px;
  }
</style>