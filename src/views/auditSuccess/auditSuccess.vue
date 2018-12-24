
<template>
    <div class="wrap">
        <el-header id="mesHade">
            <div class="telData">{{telNum}}</div>
        </el-header>
        <el-main id="auditMain">
            <div class="step-one">
                <span>1</span>身份信息<i class="solids"></i><span>2</span>店铺信息<i class="solid"></i><span class="select">3</span>入驻成功
            </div>
            <div class="setp-two">
                <img src="../../assets/successBG.png" alt="">
                <h2>恭喜您！已经通过审核，成功成为胖球商城入驻商家</h2>
            </div>
            <div class="OKlist">
                <p>登录用户名为企业邮箱地址{{email}}</p>
                <p>登录密码为法人手机号{{phone}}</p>
            </div>
            <el-button type="primary" @click="skipOd" class="skipBtn">登录胖球商城后台</el-button>
       </el-main>
    </div>
</template>

<script>

export default {
  name: 'auditSuccess',
  data () {
    return {
        telNum:'',
        phone:"",
        email:''
     }
  },
  created(){
        var loginData = localStorage.getItem("loginForm")
        var newStudents = JSON.parse(loginData)
        this.telNum = newStudents.telNum

        var userOK = localStorage.getItem("userOK")
        var userStudents = JSON.parse(userOK)
        this.email = userStudents.email
        this.phone = userStudents.phone
  },
  methods:{
      skipOd(){
             localStorage.removeItem("loginForm")
             localStorage.removeItem("userOK")
        //   this.$router.push({ path: "/auditFailure" });
             window.location.href = "/web/login"
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
@import "./auditSuccess.css";
@import '../../style/style.css';
</style>