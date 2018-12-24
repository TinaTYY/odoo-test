<template>
  <div class="wrap">
    <el-header class="headnew"></el-header>
    <el-main class="login-main">
      <div class="login-container">
        <h1>商家入驻</h1>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="手机号码：" prop="telNum">
            <el-input
              v-model="loginForm.telNum"
              placeholder="请输入手机号码"
              maxlength="11"
              @input="watchInput"
            />
          </el-form-item>
          <el-form-item id="validate" label="验证码：" prop="proving" v-if="isProvingshow">
            <el-input v-model="loginForm.proving" placeholder="请输入验证码" maxlength="4"/>
            <div id="validateImg">
              <img :src="validate" alt>
            </div>
            <span class="cut" @click="validateData">看不清，换一张</span>
          </el-form-item>
          <el-form-item label="手机验证码：" prop="identifying" id="identifying">
            <el-input v-model="loginForm.identifying" placeholder="请输入手机验证码" maxlength="6" @input="watchInputIdent"/>
            <span v-show="sendAuthCode" class="auth_text" @click="getAuthCode">获取验证码</span>
            <span v-show="!sendAuthCode" class="auth_text">
              <span class="auth_text_blue">{{auth_time}}</span> 秒之重新发送验证码
            </span>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click.native.prevent="onSubmit(loginForm)"
              :loading="loading"
              :disabled='disabled'
            >申请入驻</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </div>
</template>

<script>
import {
  verification,
  verificationCode,
  inspectVerificationCode
} from "@/api/api.js";
import VueCookies from "vue-cookies";

export default {
  name: "login",
  data() {
    let telNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else {
        if (value) {
          var reg = /^1[3456789]\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error("请输入有效的手机号码"));
          }
        }
        return callback();
      }
    };
    let proving = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入验证码"));
      } else {
        return callback();
      }
    };
    let identifying = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机验证码"));
      } else {
        return callback();
      }
    };
    return {
      sendAuthCode: true /*布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */,
      auth_time: 0 /*倒计时 计数器*/,
      validate: "",
      loading: false,
      codeShow: false,
      isProvingshow: false,
      disabled:true,
      userOK: {
        email: "",
        phone: ""
      },
      loginForm: {
        telNum: "",
        identifying: "",
        proving: ""
      },
      rules: {
        telNum: [
          {
            validator: telNum,
            trigger: "blur"
          }
        ],
        proving: [
          {
            validator: proving,
            trigger: "blur"
          }
        ],
        identifying: [
          {
            validator: identifying,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    watchInput(){
      if(this.loginForm.telNum == ""){
          this.$message.error("请输入手机号");
          this.isProvingshow = false;
          this.loginForm.proving = ""
          this.loginForm.identifying = ""
          this.disabled = true
          return;
      }else if(this.loginForm.telNum.length == 11){
        var reg = /^1[3456789]\d{9}$/;
        if (this.loginForm.telNum != "") {
          if (!reg.test(this.loginForm.telNum)) {
            this.$message.error("请输入正确的手机号");
            return;
          }else{
          this.isProvingshow = true;
          this.getRedCode()
        }
        }
      }else if(this.loginForm.telNum.length < 11 && this.loginForm.telNum.length != 0){
        this.loginForm.proving = ""
        this.loginForm.identifying = ""
        this.disabled = true
      }
      
    },
    //获取图片验证
    getRedCode() {
      // var reg = /^1[3456789]\d{9}$/;
      // if (this.loginForm.telNum == "") {
      //   this.$message.error("请输入手机号");
      //   return;
      // } else if (this.loginForm.telNum != "") {
      //   if (!reg.test(this.loginForm.telNum)) {
      //     this.$message.error("请输入正确的手机号");
      //     return;
      //   }
      // }
      verification({
        phone: this.loginForm.telNum
      }).then(res => {
        this.validate = URL.createObjectURL(res.data);
      });
    },
     // 点击更换图片验证码
    validateData() {
      this.getRedCode();
    },
    // getPhone(){
    //   console.log(2222)
    //   let isPhone = VueCookies.get('isPhone')
    //   console.log(isPhone,'>>>>>>>>')
    //   if(isPhone != this.loginForm.telNum){
    //     this.loginForm.telNum = ""
    //     this.loginForm.proving = ""
    //     this.loginForm.identifying = ""
    //      return
    //   }
    // },

    // 手机验证码
    getAuthCode: function() {
      if (this.loginForm.telNum == "") {
        this.$message.error("请输入手机号");
        return;
      } else if (this.loginForm.proving == "") {
        this.$message.error("请输入验证码");
        return;
      } else {
        verificationCode({
          params: {
            phone: this.loginForm.telNum,
            imgCode: this.loginForm.proving
          }
        }).then(res => {
          console.log("发送中....");
          var resultData = JSON.parse(res.data.result);
          if (resultData.code == -1) {
            this.$message.error(resultData.data.message);
            return;
          } else {
            this.$message.success("发送成功！");
            this.sendAuthCode = false;
            this.auth_time = 60;
            var auth_timetimer = setInterval(() => {
              this.auth_time--;
              if (this.auth_time <= 0) {
                this.sendAuthCode = true;
                clearInterval(auth_timetimer);
              }
            }, 1000);
          }
        });
      }
    },
    // 监听手机验证码 并 开启入驻按钮
    watchInputIdent(){
      if(this.loginForm.identifying.length == 6){
        if(this.loginForm.proving != "" && this.loginForm.telNum != ""){
          this.disabled = false
        }else{
          this.$message.error('请输入手机号或者验证码')
        }
      }
    },
    onSubmit(loginForm) {
      if (
        loginForm.telNum != "" &&
        loginForm.proving != "" &&
        loginForm.identifying != ""
      ) {
        inspectVerificationCode({
          params: {
            phone: this.loginForm.telNum,
            phoneVerificationCode: this.loginForm.identifying
          }
        }).then(res => {
          var resultData = JSON.parse(res.data.result);
          VueCookies.set("access_token", resultData.data.token);
          if (resultData.code == -1) {
            this.$message.error("手机验证码无效或过期");
          } else if (resultData.code == 0) {
            if (resultData.data.state == "null") {
                // 跳转商家入驻
              let loginForm = JSON.stringify(this.loginForm);
              localStorage.setItem("loginForm", loginForm);
              this.$router.push({ path: "/message" });
            } else if (resultData.data.state == "waiting") {
              //跳转待审核
              this.$router.push({ path: "/successfully" });
            } else if (resultData.data.state == "agree") {
              // 跳转成功
              let loginForm = JSON.stringify(this.loginForm);
              localStorage.setItem("loginForm", loginForm);
              this.userOK.email = resultData.data.email;
              this.userOK.phone = resultData.data.phone;
              let userOK = JSON.stringify(this.userOK);
              localStorage.setItem("userOK", userOK);
              this.$router.push({ path: "/auditSuccess" });
            } else if (resultData.data.state == "reject") {
              //跳转失败
              let loginForm = JSON.stringify(this.loginForm);
              let mag = JSON.stringify(resultData.data.mag);
              localStorage.setItem("loginForm", loginForm);
              localStorage.setItem("mag", mag);
              this.$router.push({ path: "/auditFailure" });
            }
            // 隐藏验证码
            this.isProvingshow = false;
            this.disabled = true
          }
        });
      } else {
        this.$message.error("手机号与验证码不匹配！");
        loginForm.telNum = "";
        loginForm.proving = "";
        loginForm.identifying = "";
        this.isProvingshow = false;
        this.disabled = true
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='css' scoped>
  @import "./login.css";
</style>
