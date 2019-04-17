<template>
  <div>
    <Row>
        <Col span="11">
          <Card dis-hover style="min-height:400px">
            <p slot="title">表单预览：</p>
            <form-create :rule="rules" style="margin:0 auto"></form-create>
          </Card> 
        </Col>
        <Col span="12" offset="1">
          
          <Card dis-hover style="margin-bottom:10px;min-height:190px">
            <p slot="title">已选项目：</p>
            <Tag v-for="item in titles" :key="item" :name="item" closable @on-close="handleClose">{{item}}</Tag>
          </Card> 

          <Card dis-hover style="min-height:200px">
            <p slot="title">选择项目：</p>
            <div class="customize">
              <Input type="text" v-model.trim="addTitle" placeholder="create formItem" style="height:30px;width:250px;"></Input>
              <Button type="primary" @click="handleSubmit">添加自定义项目</Button> 
            </div>
            <div class="selectOption">
              <Select v-model="selectTitles" filterable multiple>
                <Option v-for="item in defaultTitle" :value="item" :key="item">{{ item }}</Option>
              </Select>
            </div>
          </Card>
         
        </Col>
    </Row>    
  </div>
</template>

<script>
export default {
  
  data(){
    return{
      index:3700,
      defaultRules:[
        { //活动ID
          type:"hidden",
          field:"activityId", 
          value:""
        },
        { //自动补齐的字段
          type: "select",
          field: "whatClass",
          title: "班级",
          value: [],
          options: this.classOptions,
          props: {
            "multiple": false, 
            "placeholder": "请选择", 
            "not-found-text": "无匹配数据",
            "placement": "bottom", 
          }
        },
        { //自动补齐的字段
          type:"input",
          title:'姓名',
          field:'name',
          value:'',
          props:{
            // type:'text',
            placeholder:'请输入您的姓名'
          },
          validate:[
            {
              required:true,
              message:'姓名不能为空',
              trigger:'blur'
            }
          ]
        },
        { //自动补齐的字段
          type:'input',
          title:'学号',
          field:'stuNum',
          value:'',
          props:{
            // type:'number',
            placeholder:'请输入您的学号'
          },
          validate:[
            {
              required:true,
              message:'学号不能为空',
              trigger:'blur'
            }
          ]
        },
        {
          type:"radio",
          title:"性别",
          field:"sex",
          value:"0",
          options:[
              {value:"0",label:"女",disabled:false},
              {value:"1",label:"男",disabled:true},
          ]
        },
        {
          type:'input',
          title:'手机',
          field:'telphone',
          value:'',
          props:{
            // type:'tel',
            placeholder:'请输入您的手机号码'
          },
          validate:[
            {
              required:true,
              message:'手机号码不能为空',
              trigger:'blur'
            }
          ]
        },
        {
          type:'input',
          title:'邮箱',
          field:'email',
          value:'',
          props:{
            // type:'email',
            placeholder:'请输入您的邮箱'
          },
          validate:[
            {
              required:true,
              message:'邮箱不能为空',
              trigger:'blur'
            }
          ]
        },
        {
          type:'input',
          title:'备注',
          field:'remarks',
          value:'',
          props:{
            // type:'textarea',
            placeholder:'此处可输入备注'
          }
        }
      ],
      defaultTitle:['班级','姓名','学号','性别','手机','邮箱','备注'],  //避免重复
      classOptions:[],  //created加载数据
      rules:[],
      titles:[],
      selectTitles:[],
      isfirst:true, //是否首次加载
      addTitle:"",
      addRule:{ 
        type:"input",
        title:'',
        field:'',
        value:'',
        props:{
            placeholder:''
        },
        validate:[
          {
            required:true,
            message:'',
            trigger:'blur'
          }
        ]
      }
    }
  },
  methods:{
    getData(){
      // 1.获取当前用户信息，用于自动填充某些字段

      // 2.获取所有班级分组

      // 3.准备好数据
      this.rules = [...this.defaultRules];
      this.rules.forEach(item => {
        if(item.title != null){
          this.titles.push(item.title);
        }
      });
      this.selectTitles = [...this.titles];
      this.returntitle();
    },
    handleAdd () {
      alert("添加自定义项目");
    },
    handleClose (event, name) {
        const index = this.titles.indexOf(name);
        this.titles.splice(index, 1);
        this.selectTitles.splice(index,1);
        this.rules.splice(index + 1,1);
    },
    returntitle(){
      let a = [];
      this.rules.forEach(item =>{
        a.push(item.title);
      });
      console.info(a);
    },
    handleSubmit() {
        //1.不接受空值，去空格
        //2.去重
        this.addTitle = this.trim(this.addTitle);
        if(this.addTitle == "" || this.titles.includes(this.addTitle)){
          return;
        }
        //3.构建表单项目对象
        this.index++;
        this.addRule.title = this.addTitle;
        this.addRule.field = 'field' + this.index;
        this.addRule.placeholder = '请输入' + this.addRule.title;
        this.addRule.message = this.addRule.title + '不能为空';
        //4.添加到rules,同步titles,selestTitle
        console.info(this.addRule)
        this.rules.push(this.addRule);
        this.selectTitles.push(this.addRule.title);
        this.defaultTitle.push(this.addRule.title);
        this.addTitle = '';
    },
    trim(str){  //去掉字符串的空格
      return str.replace(/\s*/g,"");
    }
  },
  watch: {
    selectTitles: function (newSelect, oldSelect){
      let len = newSelect.length;
      this.titles = newSelect;
      if(this.isfirst){
        this.isfirst = false;
        return;
      }
      if(len > oldSelect.length){   //增加
        console.info("select add")
        this.defaultRules.forEach(item => {
          if(item.title == newSelect[len-1]){
            this.rules.push(item)
          }
        });
      }
      if(len < oldSelect.length){   //移除
        let bool = true;//是否移除末元素
        for(let i=0;i<len;i++){
          if(newSelect[i] != oldSelect[i]){
            console.info("selectTitles移除元素")
            this.rules.splice(i + 1,1);
            bool = false; 
            break;
          }
        }
        if(bool){
          // console.info(this.rules.pop().title)
          this.rules.pop();
          console.info("selectTitles移除末元素")
        }
      }
    }
  },
  created(){
    this.getData();
  },
  mounted(){
    this.$on("submitSignupData",() => {
      console.log("老爹，signup知道啦");
      this.$emit("submitData",this.rules);
    })
  }
}
</script>
<style>
  .selectOption {
    margin: 10px 0;
    text-align: center;
  }

  .selectOption .ivu-select-selection {
    height: 30px;
    width: 370px;
    margin: 0 auto;
  } 
  .customize {
    margin: 10px 0;
    text-align: center;
  }
  .customize button {
    height: 30px;
    margin-left: 5px;
  }
  .selectOption .ivu-tag.ivu-tag-checked {
    display: none;
  }
  .ivu-form-item-content {
    margin-left: 25% !important;
  }
  .ivu-form .ivu-form-item-label {
    width: 25% !important;
  }
</style>
