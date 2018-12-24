<template>
  <el-container id="pages">
    <el-header id="mesHade">
      <div class="telData">{{telNum}}</div>
    </el-header>
    <el-main id="mesMain">
      <div class="step-one">
        <span class="select">1</span>身份信息
        <i class="solid"></i>
        <span>2</span>店铺信息
        <i class="solids"></i>
        <span>3</span>入驻成功
      </div>
      <div class="infoList">
        <h2>企业法定代表人基本信息</h2>
        <el-form :model="userForm" :rules="rules" ref="userForm">
          <el-form-item id="formName" label="企业法定代表人姓名：" prop="name">
            <el-input v-model="userForm.name"/>
          </el-form-item>
          <el-form-item id="formPhone" label="企业法定代表人联系方式：" prop="phone">
            <el-input v-model="userForm.phone" maxlength="11"/>
          </el-form-item>
          <div class="uploadImg">
            <el-form-item id="uploadDdata" label="上传企业法定代表人身份证件像:" prop="idBack">
              <el-upload
                class="upload-demo"
                :action="uploadQiniuUrl"
                :limit="1"
                v-model="userForm.idBack"
                :drag="false"
                :auto-upload="false"
                list-type="picture-card"
                :data="postData"
                :on-change="handleChangeIDbank"
                :on-preview="handlePictureCardPreview"
                ref="upload_idBack"
                :on-success="handleAvatarSuccess"
              >
                <img src="../../assets/idBckbg.png" alt>
              </el-upload>

              <el-dialog :visible.sync="dialogVisibles">
                <img width="100%" :src="dialogImageUrls" alt>
              </el-dialog>
            </el-form-item>
            <el-form-item id="uploadF" prop="idFoot">
              <el-upload
                class="upload-demo"
                v-model="userForm.idFoot"
                :action="uploadQiniuUrl"
                :limit="1"
                :drag="false"
                :auto-upload="false"
                list-type="picture-card"
                ref="upload_banner"
                :data="postData"
                :on-change="handleChangeFoot"
                :on-preview="handlePictureCardPreviews"
                :on-success="handleAvatarSuccessD"
              >
                <img src="../../assets/idFootbg.png" alt>
              </el-upload>

              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt>
              </el-dialog>
            </el-form-item>
          </div>
          <div id="showIdback">
            <div class="showIdbacks" v-if="idCodeshow">
              <img :src="userForm.idCardImgBackUrl" alt @click="removeIDcodes">
            </div>
            <div class="showIdbacks" v-if="idCodeshow">
              <img :src="userForm.idCardImgFrontUrl" alt @click="removeIDcode">
            </div>
          </div>
          <el-form-item id="subBtn">
            <el-button type="primary" @click="onSubmit()">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getQiNiuTokenForQuickEntrance } from "@/api/api.js";

export default {
  name: "message",
  data() {
    var idBack, idFoot
    let name = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入企业法定代表人姓名"));
      } else {
        if (value) {
          var nameCode = /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,20}$/;
          if (!nameCode.test(value)) {
           return callback(new Error("请输入正确的姓名"));
          }
        }
        return callback();
      }
    };
    let phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入企业法定代表人联系方式"));
      } else {
        if (value) {
          var phoneCode = /^1[3456789]\d{9}$/;
          if (!(phoneCode.test(value))) {
           callback(new Error("请输入有效的企业法定代表人联系方式"));
          }
        }
        return callback();
      }
    };
    return {
      telNum: "",
      uploadQiniuUrl: "http://up-z1.qiniu.com/",
      upload_qiniu_addr: "https://qmall.pangqiu.com/",
      fileList: [],
      tmp_data: {},
      dialogImageUrl: "", //选中的某张图片的 url
      dialogImageUrls: "",
      postData: {}, //上传图片携带的参数
      dialogVisible: false,
      dialogVisibles: false,
      idCodeshow: false,
      num: 1,
      file: {},
      userForm: {
        name: "",
        phone: "",
        idBack: "",
        idFoot: "",
        idCardImgBackUrl: "",
        idCardImgFrontUrl: ""
      },
      usersForm: [],
      rules: {
        name: [
          {
            required: true,
            validator: name,
            message: "请输入企业法定代表人名字",
            validator: name,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入企业法定代表人联系方式",
            validator: phone,
            trigger: "blur"
          }
        ],
        idBack: [
          {
            required: true,
            message: "请上传身份证正照",
            validator: idBack,
            trigger: "change"
          }
        ],
        idFoot: [
          {
            required: true,
            message: "请上传身份证背照",
            validator: idFoot,
            trigger: "change"
          }
        ]
      }
    };
  },

  created() {
    var loginData = localStorage.getItem("loginForm");
    var newStudents = JSON.parse(loginData);
    this.telNum = newStudents.telNum;

    if (localStorage.getItem("userForm") != null) {
      var userForm = localStorage.getItem("userForm");
      var userStudents = JSON.parse(userForm);
      this.userForm.name = userStudents.name;
      this.userForm.phone = userStudents.phone;
      this.userForm.idCardImgBackUrl = userStudents.idCardImgBackUrl;
      this.userForm.idCardImgFrontUrl = userStudents.idCardImgFrontUrl;
      this.userForm.idBack = userStudents.idCardImgBackUrl;
      this.userForm.idFoot = userStudents.idCardImgFrontUrl;
      this.idCodeshow = true;
    } else {
      this.idCodeshow = false;
      return;
    }
  },

  methods: {
    // 上传身份证正图片路径
    handleChangeIDbank(file, fileList) {
      this.userForm.idBack = file.url;
      return;
    },
    // 上传身份证背图片路径
    handleChangeFoot(file, fileList) {
      this.userForm.idFoot = file.url;
      return;
    },
    //上传成功回调函数
    handleAvatarSuccess(res) {
      //上传成功后在图片框显示图片
      this.dialogImageUrls = this.upload_qiniu_addr + res.key;
      this.userForm.idCardImgBackUrl = this.upload_qiniu_addr + res.key;

      this.$refs.userForm.validate(valid => {
        if (valid) {
          let userForm = JSON.stringify(this.userForm);
          localStorage.setItem("userForm", userForm);
          this.$router.push({ path: "/infoData" });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //上传成功回调函数
    handleAvatarSuccessD(res) {
      var timestamp = new Date().getTime();
      let genRandom = parseInt(Math.random() * (((99999 - 1 + 1) | 0) + 1))
      var key ='merchant/' + timestamp + genRandom + ".jpg";
      this.dialogImageUrl = this.upload_qiniu_addr + res.key;
      this.userForm.idCardImgFrontUrl = this.upload_qiniu_addr + res.key;
      this.getTokenAndSubmit(key, () => {
        this.$refs.upload_idBack.submit();
      });
    },
    //点击预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrls = file.url;
      this.dialogVisibles = true;
      return false;
    },
    //点击预览图片
    handlePictureCardPreviews(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      return false;
    },

    //隐藏图片显示
    removeIDcodes(){
      this.idCodeshow = false;
    },
    //提交信息
    onSubmit() {
      var reg=/^1[3456789]\d{9}$/;
      let userForm = this.userForm;
      if (userForm.name == ""){
        this.$message.error("请输入正确企业法定代表人姓名");
      }else if(userForm.phone == "" || !reg.test(userForm.phone)){
        this.$message.error("请输入正确企业法定代表人联系方式");
      }else if(userForm.idBack == ""){
        this.$message.error("请上传正确身份证正照");
      }else if(userForm.idFoot == ""){
        this.$message.error("请上传正确身份证背照");
      }else if(userForm.idCardImgBackUrl != "" && userForm.idCardImgFrontUrl != ""){
          let userForm = JSON.stringify(this.userForm);
          localStorage.setItem("userForm", userForm);
          this.$router.push({ path: "/infoData" });
          this.idCodeshow = false;
      }else{
        var timestamp = new Date().getTime();
        let genRandom = parseInt(Math.random() * (((99999 - 1 + 1) | 0) + 1))
        var key ='merchant/' + timestamp + genRandom + ".jpg"; 
        this.getTokenAndSubmit(key, () => {
          this.$refs.upload_banner.submit();
        });
      } 
    },
    // 获取token并上传
    getTokenAndSubmit(key, callback) {
      getQiNiuTokenForQuickEntrance({
        params: {
          key: key
        }
      })
        .then(res => {
          var data = JSON.parse(res.data.result);
          this.postData["token"] = data.data.token;
          this.postData["key"] = key;
          callback();
        })
        .catch(err => {
          console.log("err\n", err);
        });
    },
  },
  mounted(){
            // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
            window.onbeforeunload = function (e) {
            var  n  =  window.event.screenX  -  window.screenLeft; 

          var  b  =  n  >  document.documentElement.scrollWidth-20; 

      if(b  &&  window.event.clientY  <  0  ||  window.event.altKey) {  
        //页面关闭
        var storage = window.localStorage;
            storage.clear()
              this.$cookies.remove("access_token")
              this.$refs.upload_logo.clearFiles();
              this.$refs.upload_licence.clearFiles();
              this.$refs.upload_bank.clearFiles();
              this.$refs.upload_shou.clearFiles();
              this.$refs.userForm.resetFields();
      }else{
        //页面刷新
        this.$refs.userForm.resetFields();
      }
        }
  }
}   
</script>

<style lang="css" scoped>
@import "./message.css";
@import "../../style/style.css";
</style>