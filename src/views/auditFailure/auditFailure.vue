
<template>
    <div class="wrap">
        <el-header id="mesHade">
            <div class="telData">{{telNum}}</div>
        </el-header>
        <el-main id=failMain>
            <div class="step-one">
                <span>1</span>身份信息<i class="solids"></i><span>2</span>店铺信息<i class="solid"></i><span class="select">3</span>入驻成功
            </div>
            <div class="step-two">
                <img src="../../assets/failBG.png" alt="">
                <h2>很遗憾，由于"{{msg}}"原因您没有通过审核</h2>
            </div>
            <el-button type="primary" @click="skipOd" class="skipBtn">重新提交入驻信息</el-button>
        </el-main>
    </div>
</template>

<script>
export default {
  name: 'auditFailure',
  data () {
    return {
        msg:"",
        telNum:''
     }
  },
  created(){
        var loginData = localStorage.getItem("loginForm")
        var newStudents = JSON.parse(loginData)
        this.telNum = newStudents.telNum

        var mag = localStorage.getItem("mag")
        var newMsg = JSON.parse(mag)
        this.msg = newMsg
        
  },
  methods:{
      skipOd(){
          localStorage.removeItem("mag")
          this.$router.push({ path: "/message" }); 
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
</style>
<style lang='css' scoped>
    @import './auditFailure.css';
    @import '../../style/style.css';
</style>