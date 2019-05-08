<template>
  <div class="login">
    <div id="web_bg"></div>      
    <Row  class="login-model">
        <Col span="24">
          <div class="login-con">
            <h2>用户登录</h2>
            <br>
            <Form @submit.native.prevent="handleSubmit" ref="formItem" :model="formItem" :rules="FromRule" >
                <FormItem prop="account">
                  <Input :disabled="isValidate" v-model.trim="formItem.account" type="text" placeholder="用户名">
                      <Icon type="md-person"  slot="prepend"/>
                  </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input :disabled="isValidate" v-model.trim="formItem.password" type="password" placeholder="密码">
                        <Icon type="ios-lock" slot="prepend"/>
                    </Input>
                </FormItem>
                <FormItem>
                    <Checkbox :disabled="isValidate" v-model="formItem.agree">下次登录记住我的身份</Checkbox><br>
                    <Button :loading="isSubmit"  :disabled="isValidate" html-type="submit" type="primary">
                        {{isValidate ? '登录验证中':'立即登录'}}
                    </Button>
                </FormItem>
            </Form>
          </div>
        </Col>
    </Row>
  </div>
</template>
<script>
  import md5 from 'js-md5';
  import { post } from '@/libs/axios-cfg'
  export default {
        data () {
            return {
                isSubmit:false,
                formItem: {
                    account:'',
                    password:'',
                    validateCode:'',
                    agree:true
                },
                isValidate:false,
                FromRule:{
                    account:[
                        { required: true, message: '账号不能为空' }
                    ],
                    password:[
                        {required: true, message: '请填写密码', },
                        { type: 'string',min:6, message: '密码长度不能小于6位',  }
                    ]
                }
            }
        },
        methods: {
            handleSubmit() {
                if(this.isValidate){
                    return false;
                }
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        this.login()
                    }
                });
            },
            async login(){
                this.isValidate = true;
                const loadings = this.$Message.loading({
                    content: '用户信息验证中...',
                    duration: 0
                });
                try {
                    let res = await post('/account/sign-in',{
                      username: this.formItem.account,
                      password: this.formItem.password
                    })
                    this.$Message.success("登录成功");
                    localStorage.setItem('csrf-token', res.data);
                    this.$store.commit('setToken', res.data);
                    let resp = await post('/account/current')
                    this.$store.commit('setUserId', resp.data.id);
                    this.$store.commit('setUserName', resp.data.username);
                    this.$store.commit('setAparId', resp.data.aparId);
                    this.$store.commit('setStuId',resp.data.stuId);
                    this.$router.push({name: 'home'});
                } catch (error) {
                    this.$throw(error)
                }
                setTimeout(loadings, 0);
                this.isValidate = false;
            }
        }
    }
</script>
<style>
  body{
    /* background-image: url("../../../assets/images/login-bg.jpg"); */
    height: 100%;
  }
  #web_bg{
  background-image: url("../../../assets/images/banner.jpg");
  position:fixed;
  top: 0;
  left: 0;
  width:100%;
  height:100%;
  min-width: 1000px;
  z-index:-10;
  zoom: 1;
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  background-position: center 0;
}
.login-model{
  width: 350px;
  float: right;
  margin-right: 206px;
  display: inline-block;
  margin-top: 100px;   
}
.login-con {
  padding: 20px 30px;
  font-size: 0.8rem;
  cursor: pointer;
  width: 100%;
  border-radius: 6px;
  text-align: center;
  position: relative;
  z-index: 1;
  color: #ffffff;
  font-weight: bold;
  border: 3px solid rgba(255,255,255,.8);
  background: rgba(0,0,0,.1);
  box-sizing: border-box;
  transition: all .3s;
  -webkit-transition: all .3s;
  -moz-transition: all .3s;
  font-family: 'Helvetica-Bold';
  letter-spacing: 0;
}
.ivu-form-item-error .ivu-input {
  border:#f58ea9 solid 1px;
}
.ivu-form-item-error .ivu-input:hover {
  border-color: #f58ea9;
}
.ivu-form-item-error-tip {
  position: absolute;
  top: 100%;
  left: 0;
  line-height: 1;
  padding-top: 6px;
  color: #f58ea9;
}
.ivu-form-item-error .ivu-input-group-append, .ivu-form-item-error .ivu-input-group-prepend{
   border:#f58ea9 solid 1px;
}
</style>