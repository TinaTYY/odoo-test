<template>
    <div class="wrap">
        <el-header id="mesHade"></el-header>
        <el-main id="succssMain">
            <div class="step-one">
                <span>1</span>身份信息<i class="solids"></i><span>2</span>店铺信息<i class="solid"></i><span class="select">3</span>入驻成功
            </div>
            <div class="sussList">
                <h2>您已经成功提交入驻信息，请等待平台审核</h2>
                <p>胖球商城工作人员会在1-3个工作日内完成审核，请耐心等待并关注审核结果</p>
                <div>
                    <img src="../../assets/merCode.png" alt="">
                    <ul>
                        <li>如有任何问题都可以联系我们：</li>
                        <li>联系电话：15201674795</li>
                        <li>010-65867200</li>
                        <li>客服：     关注公众号pqiu01或者扫描左侧二维码关注公众号</li>
                    </ul>
                </div>
                <p class="cist">北京七彩焕腾科技有限公司</p>
            </div>
        </el-main>
    </div>
</template>

<script>
export default {
  name: 'successfully',
  data () {
    return {
        name:""
     }
  },
  mounted(){
            // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
      window.onbeforeunload = function (e) {
          var storage = window.localStorage;
            storage.clear()
              this.$cookies.remove("access_token")
          }
        }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
    @import "./successfully.css";
    @import '../../style/style.css';
</style>