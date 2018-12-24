<template>
  <div class="wrap">
    <el-header id="mesHade">
      <div class="telData">{{telNum}}</div>
    </el-header>
    <el-main class="message-container">
      <div class="step-one">
        <span>1</span>身份信息
        <i class="solids"></i>
        <span class="select">2</span>店铺信息
        <i class="solid"></i>
        <span>3</span>入驻成功
      </div>
      <div class="infoList">
        <h2>1.店铺基本信息</h2>
        <el-form :model="information" :rules="rules" ref="information">
          <el-form-item label="主营类目" prop="categoryName">
            <el-input v-model="information.categoryName" :disabled="true" type="textarea" class="brandNames"/>
            <div v-show="showData">
              <el-checkbox-group
                v-model="information.categoryName"
                @change="categorysChange($event)"
              >
                <el-checkbox
                  v-for="category in cities"
                  :value="category.categoryId"
                  :label="category.name"
                  :key="category.name"
                ></el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="经营品牌" prop="brandName">
            <el-input v-model="information.brandName" class="brandName" type="textarea" :disabled="true"/>
            <el-button @click="focusData" type="primary">选择品牌</el-button>
            <el-button @click="clearData" type="info">清除品牌</el-button>
            <el-dialog title="选择品牌" :visible.sync="brandList.dialogFormVisible" :before-close="handleDialogClose">
              <el-form>
                <el-form-item label="品牌名称" prop="tableDataName" id="brand">
                  <el-input v-model="tableDataName"></el-input>
                  <el-button @click="doFilter" type="primary">筛选</el-button>
                </el-form-item>
                <el-form-item>
                  <div v-show="tableDataEnd != ''">
                    <el-table
                      ref="multipleTable"
                      :data="tableDataEnd"
                      tooltip-effect="dark"
                      style="width: 100%"
                      @selection-change="handleSelectionChange"
                    >
                      <el-table-column type="selection"></el-table-column>
                      <el-table-column label="品牌中文名称">
                        <template slot-scope="scope">{{ scope.row.nameCn }}</template>
                      </el-table-column>
                      <el-table-column prop="nameEn" label="品牌英文名称"></el-table-column>
                      <el-table-column prop="country" label="所属国家" show-overflow-tooltip></el-table-column>
                      <el-table-column prop="logo" label="品牌logo" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <img :src="scope.row.logo" alt style="width: 50px;height: 50px">
                        </template>
                      </el-table-column>
                    </el-table>

                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[5, 10, 15, 20]"
                      :page-size="pageSize"
                      layout="prev, pager, next, jumper"
                      :total="totalItems"
                      id="pagination"
                    ></el-pagination>

                    <div id="newList">
                      <span>已选品牌</span>
                      <div class="newlistData">
                        <div v-for="newList in multipleSelection" :key="newList.id">
                          <img :src="newList.logo" alt class="newListImg">
                          <p style="line-height:20px; margin-top:0;text-overflow: ellipsis;overflow:hidden">{{newList.nameCn}}</p>
                        </div>
                      </div>
                    </div>
                    <el-form-item>
                      <el-button
                        type="primary"
                        @click="newSum(multipleSelection)"
                        v-if="brandList.dialogFormVisible"
                      >确认</el-button>
                      <el-button @click="newCelar">关闭</el-button>
                    </el-form-item>
                  </div>
                  <div v-show="tableDataEnd == ''">
                    <p>
                      <img src alt>
                      <span class="hint">没有您要查询得品牌，请添加您需要得品牌</span>
                      <el-form-item>
                        <el-button type="primary" @click="restForm.dialogFormVisible = true">添加新品牌</el-button>
                        <el-dialog
                          title="新建品牌"
                          :visible.sync="restForm.dialogFormVisible"
                          append-to-body="true"
                          id="xinjian"
                        >
                          <el-form :model="form" ref="form">
                            <el-form-item label="中文名称" prop="nameCn">
                              <el-input
                                v-model="form.nameCn"
                                placeholder="限10个汉字"
                                maxlength="10"
                                autocomplete="off"
                              ></el-input>
                            </el-form-item>
                            <el-form-item label="英文名称" prop="nameEn">
                              <el-input
                                v-model="form.nameEn"
                                placeholder="限30个英文字母"
                                autocomplete="off"
                                maxlength="30"
                              ></el-input>
                            </el-form-item>
                            <el-form-item label="所属国家">
                              <el-select v-model="code.cn">
                                <el-option
                                  v-for="item in nationData"
                                  :label="item.cn"
                                  :key="item.code"
                                  :value="item.code"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                            <el-form-item label="上传图片" id="tishiImg">
                              <!-- 品牌上传 -->
                              <el-upload
                                class="uploadK"
                                :action="uploadQiniuUrl"
                                :drag="false"
                                :limit="1"
                                :on-remove="handleRemove"
                                :on-preview="handlePictureCardPreview"
                                :auto-upload="false"
                                list-type="picture-card"
                                :data="postData"
                                ref="upload_idBack"
                                :on-change="handleAvatarChangecode"
                                :on-success="handleAvatarSuccess"
                              >
                                <i class="el-icon-plus"></i>
                              </el-upload>
                              <ol class="tishi">
                                <li>上传图片要求：</li>
                                <li>1.尺寸宽高不小于150</li>
                                <li>2.格式：jpg、png</li>
                              </ol>
                              <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt>
                              </el-dialog>
                            </el-form-item>
                          </el-form>
                          <div slot="footer" class="dialog-footer">
                            <el-button @click="resultForm(form)">取 消</el-button>
                            <el-button
                              type="primary"
                              @click="resFrombtn"
                              v-if="restForm.dialogFormVisible"
                            >确 定</el-button>
                          </div>
                        </el-dialog>
                        <el-button @click="gunBtn">关闭</el-button>
                      </el-form-item>
                    </p>
                  </div>
                </el-form-item>
              </el-form>
              <!-- <div slot="footer" class="dialog-footer" v-show="tableDataName != ''">
                                    <el-button @click="brandList.dialogFormVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="brandList.dialogFormVisible = false">确 定</el-button>
              </div>-->
            </el-dialog>
          </el-form-item>

          <el-form-item label="店铺名称" prop="nickName">
            <el-input v-model="information.nickName"/>
          </el-form-item>
          <el-form-item label="店铺邮箱" prop="email">
            <el-input v-model="information.email"/>
          </el-form-item>
          <el-form-item label="店铺LOGO" prop="logoImg">
            <!-- 店铺LOGO -->
            <el-upload
              v-model="information.logoImg"
              class="uploadK"
              :action="uploadQiniuUrl"
              :limit="1"
              :drag="false"
              :on-remove="handleRemovelogo"
              :on-preview="handlePictureCardPreviews"
              :auto-upload="false"
              list-type="picture-card"
              :data="postData"
              ref="upload_logo"
              :on-change="handleFChange"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccessD"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogLogoVisible">
              <img width="100%" :src="dialogLogoImagesUrl" alt>
            </el-dialog>
            <span class="txtList">上传logo尺寸要求至少为340*340</span>
          </el-form-item>

          <h2>2.入驻企业信息</h2>
          <el-form-item label="企业名称" prop="enterpriseName">
            <el-input v-model="information.enterpriseName"/>
          </el-form-item>
          <el-form-item label="营业执照" prop="licenceImg" id="licenceImg">
            <!-- 营业执照 -->
            <el-upload
              v-model="information.licenceImg"
              class="uploadK"
              :action="uploadQiniuUrl"
              :limit="1"
              :drag="false"
              :on-remove="handleRemovelicence"
              :on-preview="handlePictureCardPreviewlicence"
              :auto-upload="false"
              list-type="picture-card"
              :data="postData"
              ref="upload_licence"
              :on-change="handleChangelicence"
              :on-success="handleAvatarSuccesslicence"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisiblelicence">
              <img width="100%" :src="dialogImageUrllicence" alt>
            </el-dialog>
            <!-- <span class="txtList" id=4 @click="btnImg($event)" style="color: blue">营业执照范例</span> -->
            <el-button type="text" @click="open">营业执照范例</el-button>
          </el-form-item>
          <el-form-item id="cityData" label="经营地址" prop="addressDetail">
            <el-form :model="city">
              <el-select v-model="city.sheng" @change="choseProvince" placeholder="省级地区">
                <el-option
                  v-for="item in city.province"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="city.shi" @change="choseCity" placeholder="市级地区">
                <el-option
                  v-for="item in city.shi1"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="city.qu" @change="choseBlock" placeholder="区级地区">
                <el-option
                  v-for="item in city.qu1"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                v-model="information.addressDetail"
                placeholder="详细地址"
                @blur="addressBtn(city)"
              />
            </el-form>
          </el-form-item>

          <h2>3.对公打款账户信息</h2>
          <el-form-item label="银行账户" prop="bankNo">
            <el-input
              v-model="information.bankNo"
              minlength="15"
              maxlength="19"
              @blur="bankNoData"
            />
          </el-form-item>
          <el-form-item label="开户名" prop="bankName">
            <el-input v-model="information.bankName" :disabled="true"/>
          </el-form-item>
          <el-form-item label="开户行" prop="bankType">
            <el-input v-model="information.bankType"/>
          </el-form-item>
          <el-form-item label="开户许可证或基本账户存款凭证" prop="bankImg" id="bankVouchersUrl">
            <!-- 开户许可证 -->
            <el-upload
              v-model="information.bankType"
              class="uploadK"
              :action="uploadQiniuUrl"
              :limit="1"
              :drag="false"
              :on-remove="handleRemovebank"
              :on-preview="handlePictureCardPreviewbank"
              :auto-upload="false"
              list-type="picture-card"
              :data="postData"
              ref="upload_bank"
              :on-change="handleChangebank"
              :on-success="handleAvatarSuccessbank"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisiblebank">
              <img width="100%" :src="dialogImageUrlbank" alt>
            </el-dialog>
            <ul>
              <li>若所在地未取消开户许可证核发，请上传开户许可证</li>
              <li style="color: blue" @click="open1">查看《开户许可证》范例</li>
              <li>若所在地取消开户许可证核发，请上传开户银行盖章的基本存款账户凭证</li>
              <li style="color: blue" @click="open2">范例一：《开立银行结算账户清单和申请书》</li>
              <li style="color: blue" @click="open3">范例二：《基本存款账户凭证》范例</li>
            </ul>
          </el-form-item>

          <h2>4.品牌授权书</h2>
          <el-form-item id="Successshou">
            <!-- 品牌授权 -->
            <el-upload
              class="uploadK"
              :action="uploadQiniuUrl"
              multiple
              :drag="false"
              :on-remove="handleRemoveshou"
              :on-preview="handlePictureCardPreviewshou"
              :auto-upload="false"
              list-type="picture-card"
              :data="postData"
              :file-list="fileList"
              :show-file-list="true"
              ref="upload_shou"
              :before-upload="beforeUploadGetKey"
              :on-change="handleChangeshou"
              :on-success="handleAvatarSuccessshou"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisibleshou">
              <img width="100%" :src="dialogImagesUrlshou" alt>
            </el-dialog>
            <span class="txtList">品牌授权书可以上传多张<b style="color:red">(选填)</b></span>
          </el-form-item>
          <el-form-item prop="radio" id="radioList">
            <el-radio v-model="information.radio" label="1">
              <el-button @click="showlDialog">我已经阅读并同意《胖球商城平台合作协议》</el-button>
            </el-radio>
            <Protocol v-on:protocolShow="showlDialog" v-if="protocolShow"></Protocol>
          </el-form-item>
          <el-form-item id="btn">
            <el-button type="primary" @click="onBack">上一步</el-button>
            <el-button type="primary" @click="onSubmit" :disabled = 'disabled'>下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
  </div>
</template>

<script>
import axios from "axios";
import {
  brandCategory,
  sellerInfo,
  getQiNiuTokenForQuickEntrance
} from "@/api/api.js";
import VueCookies from "vue-cookies";
import Protocol from "../../components/protocol";

export default {
  name: "infoData",
  components: { Protocol },
  data() {
    var categoryName,
      brandName,
      nickName,
      enterpriseName,
      bankName,
      bankType,
      radio,
      bankImg,
      bankNo,
      licenceImg,
      logoImg;

    var email = (rule, value, callback) => {
      if (value == "") {
        return callback(new Error("请正确填写邮箱"));
      } else {
        if (value != "") {
          var emailCode = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!emailCode.test(value)) {
            return callback(new Error("请输入有效的邮箱"));
          }
        }
        return callback();
      }
    };
    // var bankNo = (rule, value, callback) => {
    //   if (value === "") {
    //     return callback(new Error("请正确输入银行账号"));
    //   } else {
    //     if (value !== "") {
    //       var bankNocode = /^([1-9]{1})(\d{14}|\d{18})$/;
    //       if (!bankNocode.test(value)) {
    //         return callback(new Error("请输入正确的银行账号"));
    //       }
    //     }
    //     return callback();
    //    }
    // };
    let addressDetail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入企业地址"));
      } else {
        return callback();
      }
    };
    return {
      mapJosn: "../../../static/map.json",
      numArr: [],
      telNum: "",
      identifying: "",
      imgshow: false, // 示例显示
      img1show: false,
      img2show: false,
      img3show: false,
      uploadQiniuUrl: "http://up-z1.qiniu.com/",
      upload_qiniu_addr: "https://qmall.pangqiu.com/",
      showData: true, // 下拉选择
      protocolShow: false, // 合作协议
      dialogVisible: false,
      imageNum:0,
      dialogImageUrl: "",
      disabled:false,
      dialogLogoVisible: false,
      dialogLogoImagesUrl: "",

      dialogVisiblelicence: false,
      dialogImageUrllicence: "",

      dialogVisiblebank: false,
      dialogImageUrlbank: "",

      dialogVisibleshou: false,
      dialogImagesUrlshou: "",
      brandList: {
        dialogFormVisible: false // 选择品牌显示
      },
      multipleSelection: [], //品牌删选
      restForm: {
        dialogFormVisible: false
      },
      // 品类信息
      cities: [],
      postData: {},
      // 品牌信息
      tableDataBegin: [],
      tableDataName: "", // 品牌筛选
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 5,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,

      nationData: [], // 国家类别
      fileList: [],
      // 商家信息
      information: {
        applyPhone: "",
        name: "",
        phone: "",
        idCardImgFrontUrl: "",
        idCardImgBackUrl: "",
        categorys: [],
        categoryName: [],
        brands: [],
        nickName: "",
        email: "",
        enterpriseName: "",
        bankNo: "",
        bankName: "",
        bankType: "",
        radio: "",
        formData: "",
        bankImg: "",
        licenceImg: "",
        logoImg: "",
        nation: "",
        addressDetail: "",
        province: "",
        city: "",
        district: "",
        inspectBrands: [],
        brandName: [], //显示选择品牌
        brandWarrantImage: [],
        brandWarrantImages: [],
        logoImgUrl: "",
        licenceImgUrl: "",
        bankVouchersUrl: ""
      },
      // 三级联动
      city: {
        province: "",
        sheng: "",
        shi: "",
        shi1: [],
        qu: "",
        qu1: [],
        city: "",
        block: "",
        E: ""
      },
      code: { code: "CN", en: "China", cn: "中国" }, //默认选择
      formImg: "",
      // 新建品牌信息
      form: {
        nameCn: "",
        nameEn: ""
      },
      imgName:'',
      imgStatus:0,
      rules: {
        categoryName: [
          {
            type: "array",
            required: true,
            validator: categoryName,
            message: "请至少选择一个经营类目",
            trigger: "change"
          }
        ],
        brandName: [
          {
            type: "array",
            required: true,
            validator: brandName,
            message: "请至少选择一个品牌",
            trigger: "blur"
          }
        ],
        nickName: [
          {
            required: true,
            message: "请输入店铺名称",
            validator: nickName,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            validator: email,
            trigger: "blur"
          }
        ],
        logoImg: [
          {
            required: true,
            message: "请上传商铺LOGO",
            validator: logoImg,
            trigger: "blur"
          }
        ],
        enterpriseName: [
          {
            required: true,
            message: "请输入企业名称",
            validator: enterpriseName,
            trigger: "blur"
          }
        ],
        licenceImg: [
          {
            required: true,
            message: "请上传营业执照",
            validator: licenceImg,
            trigger: "blur"
          }
        ],
        addressDetail: [{ validator: addressDetail, trigger: "blur" }],
        bankNo: [
          {
            required: true,
            message: "请输入正确得银行账户",
            validator: bankNo,
            trigger: "change"
          }
        ],
        bankName: [
          {
            required: true,
            message: "请输入开户名称",
            validator: bankName,
            trigger: "blur"
          }
        ],
        bankType: [
          {
            required: true,
            message: "请输入开户行名称",
            validator: bankType,
            trigger: "blur"
          }
        ],
        bankImg: [
          {
            required: true,
            message: "请上传开户许可证或基本账户存款凭证",
            validator: bankImg,
            trigger: "blur"
          }
        ],
        radio: [
          {
            required: true,
            message: "请阅读并同意合作协议",
            validator: radio,
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    var loginData = localStorage.getItem("loginForm");
    var newStudents = JSON.parse(loginData);

    this.information.applyPhone = newStudents.telNum;

    var userForm = localStorage.getItem("userForm");
    var usrStudents = JSON.parse(userForm);

    this.information.name = usrStudents.name;
    this.information.phone = usrStudents.phone;
    this.information.idCardImgBackUrl = usrStudents.idCardImgBackUrl;
    this.information.idCardImgFrontUrl = usrStudents.idCardImgFrontUrl;
        

    this.getCityData();
    this.getnationData();
    //获取品类
    this.categoryData();

    var information = localStorage.getItem("information");
    var infoStudents = JSON.parse(information);

        this.information.categorys= infoStudents.categorys
        this.information.categoryName= infoStudents.categoryName
        this.information.brands= infoStudents.brands
        this.information.nickName= infoStudents.nickName
        this.information.email= infoStudents.email
        this.information.enterpriseName= infoStudents.enterpriseName
        this.information.bankNo= infoStudents.bankNo
        this.information.bankName= infoStudents.bankName
        this.information.bankType= infoStudents.bankType
        this.information.radio= infoStudents.radio
        this.information.bankImg= infoStudents.bankImg
        this.information.licenceImg= infoStudents.licenceImg
        this.information.logoImg= infoStudents.logoImg
        this.information.nation= infoStudents.nation
        this.information.addressDetail= infoStudents.addressDetail,
        this.information.province= infoStudents.province
        this.information.city= infoStudents.city
        this.information.district= infoStudents.district
        this.information.inspectBrands= infoStudents.inspectBrands
        this.information.brandName= infoStudents.brandName
        this.information.brandWarrantImage= infoStudents.brandWarrantImage
        this.information.brandWarrantImages= infoStudents.brandWarrantImages
        this.information.logoImgUrl= infoStudents.logoImgUrl
        this.information.licenceImgUrl= infoStudents.licenceImgUrl
        this.information.bankVouchersUrl= infoStudents.bankVouchersUrl

    
  },
  methods: {
    protocolHide(data) {},
    // 获取品类
    categoryData() {
      brandCategory({
        params: {
          phone: this.telNum,
          VALIDATIONCODE: this.identifying
        }
      }).then(res => {
        this.cities = res.data.data.categoryList;
      });
    },
    // 获取品类ID
    categorysChange(e) {
      var arr = [];
      var categorys = this.information.categorys;
      for (var cate in this.cities) {
        for (var item in this.information.categoryName) {
          if (this.information.categoryName[item] == this.cities[cate].name) {
            arr.push(this.cities[cate].categoryId);
            this.information.categorys = arr;
            // for (var a in arr) {
            //   if (arr.indexOf(arr[a]) == -1) {
            //     categorys.push(arr[a]);
            //   }
            // }
          }
        }
      }
    },
    // 选择品牌弹窗
    focusData() {
      brandCategory({
        params: {
          phone: this.telNum,
          VALIDATIONCODE: this.identifying
        }
      }).then(res => {
        this.tableDataBegin = res.data.data.brandList;
        this.numArr = this.tableDataBegin;
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      });
      this.brandList.dialogFormVisible = true;
      // this.tableDataBegin = [{nameCn:'324',brandId:'1'},
      // {nameCn:'12323',brandId:'1'},{nameCn:'123423',brandId:'1'},{nameCn:'234',brandId:'1'},{nameCn:'234',brandId:'1'},{nameCn:'23',brandId:'1'},
      // {nameCn:'23',brandId:'1'},{nameCn:'234',brandId:'1'},{nameCn:'122343',brandId:'1'},{nameCn:'234',brandId:'1'},{nameCn:'34',brandId:'1'}]
      // this.numArr = this.tableDataBegin;
      //   this.totalItems = this.tableDataBegin.length;
      //   if (this.totalItems > this.pageSize) {
      //     for (let index = 0; index < this.pageSize; index++) {
      //       this.tableDataEnd.push(this.tableDataBegin[index]);
      //     }
      //   } else {
      //     this.tableDataEnd = this.tableDataBegin;
      //   }
      // this.brandList.dialogFormVisible = true;
    },
    // 清除品牌数据
    clearData() {
      this.information.brandName = [];
      this.information.brands = [];
    },
    // 上传失败
    // uploadError() {
    //   this.$message.error("上传失败，请重新上传");
    //   // this.showNoticeUploading = false
    // },
    //品牌LOGO上传成功后在图片框显示图片回调
    handleAvatarSuccess(res) {
      let formObj = {};
      this.dialogImageUrl = this.upload_qiniu_addr + res.key;
      formObj.imgUrl = this.dialogImageUrl;
      formObj.code = this.code.code;
      formObj.nameCn = this.form.nameCn;
      formObj.nameEn = this.form.nameEn;
      this.information.brandName.push(this.form.nameCn);
      this.information.inspectBrands.push(formObj);
      this.$refs.form.resetFields();
      this.$refs.upload_idBack.clearFiles();
      this.$message.success('品牌上传成功');
      this.restForm.dialogFormVisible = false;
    },
    //上传品牌前获取路径
    handleAvatarChangecode(file, fileList) {
      this.formImg = file.url;
    },
    //预览品牌LOGO图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //上传成功店铺LOGO回调
    handleAvatarSuccessD(res) {
      var timestamp = new Date().getTime();
      let genRandom = parseInt(Math.random() * (((99999 - 1 + 1) | 0) + 1))
      var key ='merchant/'+ timestamp + genRandom + ".jpg"; 
      this.dialogLogoImagesUrl = this.upload_qiniu_addr + res.key;
      this.information.logoImgUrl = this.dialogLogoImagesUrl;
      this.getTokenAndSubmit(key, () => {
        this.$refs.upload_licence.submit();
      });
    },
    //预览店铺LOGO图片
    handlePictureCardPreviews(file) {
      this.dialogLogoImagesUrl = file.url;
      this.dialogLogoVisible = true;
    },

    // 上传店铺LOGO成功前获取路径
    handleFChange(file, fileList) {
      this.information.logoImg = file.url;
      return;
    },
    //限制店铺LOGO大小
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传LOGO图片大小至少 340*340!");
      }
      return isLt2M;
    },

    //上传成功营业执照
    handleAvatarSuccesslicence(res) {
      var timestamp = new Date().getTime();
      let genRandom = parseInt(Math.random() * (((99999 - 1 + 1) | 0) + 1))
      var key = 'merchant/' + timestamp + genRandom + ".jpg"; 
      this.dialogImageUrllicence = this.upload_qiniu_addr + res.key;
      this.information.licenceImgUrl = this.upload_qiniu_addr + res.key;
      this.getTokenAndSubmit(key, () => {
        this.$refs.upload_bank.submit();
      });
    },
    //预览营业执照图片
    handlePictureCardPreviewlicence(file) {
      this.dialogImageUrllicence = file.url;
      this.dialogVisiblelicence = true;
    },

    // 上传营业执照成功前获取路径
    handleChangelicence(file, fileList) {
      this.information.licenceImg = file.url;
      return;
    },

    //上传成功开户许可照
    handleAvatarSuccessbank(res) {
      this.dialogImageUrlbank = this.upload_qiniu_addr + res.key;
      this.information.bankVouchersUrl = this.dialogImageUrlbank;
      this.skipSum()
    
    },
    //预览开户许可照图片
    handlePictureCardPreviewbank(file) {
      this.dialogImageUrlbank = file.url;
      this.dialogVisiblebank = true;
      return;
    },

    // 上传开户许可照成功前获取路径
    handleChangebank(file, fileList) {
      this.information.bankImg = file.url;
      return;
    },

    
    //上传成功后在图片框显示图片
    handleAvatarSuccessshou(res, file, fileList) {
      this.imgName = file.name
      
      this.information.brandWarrantImages.push(
        this.upload_qiniu_addr + res.key
      );
      if(this.information.brandWarrantImages.length == this.imageNum){
          var timestamp = new Date().getTime();
          let genRandom = parseInt(Math.random() * (((99999 - 1 + 1) | 0) + 1))
          var key = 'merchant/'+ timestamp + genRandom + ".jpg"; 
          this.getTokenAndSubmit(key, () => {
            this.$refs.upload_logo.submit();
          });
      }else(
          console.log('继续上传中...')
      )
      
     
    },
    //预览品牌授权书图片
    handlePictureCardPreviewshou(file, fileList) {
      this.dialogImagesUrlshou = file.url;
      this.dialogVisibleshou = true;
      return;
    },
        // //上传失败后
        //         uploadError: function (res, file, fileList) {
        //             this.$message.error("上传失败，请检查文件名是否重复，重新上传！！！")
        //             this.imageNum = 0
        //         },
    // 获取KOTEN
    beforeUploadGetKey(file) {   //每个文件上传之前 给它一个 名字
        var timestamp = new Date().getTime();
        let genRandom = parseInt(Math.random() * (((99999 - 1 + 1) | 0) + 1))
        var key = 'merchant/'+ timestamp + genRandom + ".jpg"; 
        this.imageNum++;
        return  getQiNiuTokenForQuickEntrance({
        params: {
          key: key
        }
      })
        .then(res => {
          var data = JSON.parse(res.data.result);
          this.postData["token"] = data.data.token;
          this.postData["key"] = key;
        })
        .catch(err => {
          console.log("err\n", err);
        });  
    },
    // 上传成功前获取路径
    handleChangeshou(file, fileList) {
      this.imgStatus = 1
      
      // let brandFile = fileList
      // var setbrandW = new Set(brandFile);
      // let brandArr = Array.from(setbrandW);
      // let brandWarr = this.information.brandWarrantImage
      // brandArr.forEach((item,index)=>{
      //   brandWarr.push(item.url)
      // })
      // let brandImg = brandWarr.concat(brandWarr)
      // let setImg = new Set(brandImg)
      // let brandImgList = Array.from(setImg)
      // this.information.brandWarrantImage = brandImgList
      // this.fileList = this.information.brandWarrantImage
    },

    // 删除品牌图片
    handleRemove(file, fileList) {
      this.formImg = "";
    },
    // 删除营业图片
    handleRemovelicence(file, fileList) {
      this.information.licenceImg = "";
    },
    // 删除LOGO图片
    handleRemovelogo(file, fileList) {
      this.information.logoImg = "";
    },
    // 删除开户图片
    handleRemovebank(file, fileList) {
      this.information.bankImg = "";
    },
    // 删除授权图片
    handleRemoveshou(file, fileList) {
      // if(this.imageNum>0){
      //     this.imageNum--;
      //     return
      // }
    },

    // 点击开户账号
    bankNoData() {
      this.information.bankName = this.information.enterpriseName;
    },
    //打开营业执照范例
    open() {
      const businessLicence = require("../../assets/businessLicence.png");
      this.$alert(
        "<img src=" + businessLicence + " width=390px height=500px>",
        "营业执照范例",
        {
          dangerouslyUseHTMLString: true
        }
      );
    },
    //打开开户许可范例
    open1() {
      const establish = require("../../assets/establish.png");
      this.$alert(
        "<img src=" + establish + " width=390px height=260px>",
        "开户许可范例",
        {
          dangerouslyUseHTMLString: true
        }
      );
    },
    //打开结算账户清单范例
    open2() {
      const inventory = require("../../assets/inventory.png");
      this.$alert(
        "<img src=" + inventory + " width=400px height=200px>",
        "结算账户清单范例",
        {
          dangerouslyUseHTMLString: true
        }
      );
    },
    //打开基本账户范例
    open3() {
      const deposit = require("../../assets/deposit.png");
      this.$alert(
        "<img src=" + deposit + " width=400px height=200px>",
        "基本账户范例",
        {
          dangerouslyUseHTMLString: true
        }
      );
    },
    //打开胖球合作协议
    showlDialog(data) {
      if (data == "false") {
        this.protocolShow = false;
      } else {
        this.protocolShow = true;
      }
    },
    //选择品牌确认
    newSum(multipleSelection) {
      let brandList = multipleSelection;
      var set = new Set(brandList);
      let bankArr = Array.from(set);

      let bankArrlist = this.information.brandName;
      let bankId = this.information.brands;

      bankArr.forEach((item, index) => {
        bankArrlist.push(item.nameCn);
        bankId.push(item.brandId);
        // this.information.brands = item.brandId
      });

      let bankName = bankArrlist.concat(bankArrlist);
      let bankIdlist = bankId.concat(bankId);

      let setData = new Set(bankName);
      let setList = Array.from(setData);

      let brandArr = new Set(bankIdlist);
      let setListArr = Array.from(brandArr);

      this.information.brandName = setList;
      this.information.brands = setListArr;
      this.brandList.dialogFormVisible = false;
      this.tableDataEnd = [];
      this.currentPage = 1;
      this.tableDataName = "";
    },
    // 点击X关闭Dialog 清空数据
    handleDialogClose(){
      this.tableDataBegin = []
      this.tableDataEnd = []
      this.currentPage = 1
      this.tableDataName = ""
      this.brandList.dialogFormVisible = false;
    },
    //新建品牌关闭
    gunBtn() {
      this.tableDataName = "";
      this.brandList.dialogFormVisible = false;
    },
    //品牌点击取消
    newCelar() {
      this.tableDataBegin = []
      this.tableDataEnd = []
      this.currentPage = 1
      this.tableDataName = "",
      this.brandList.dialogFormVisible = false;
    },

    // 品牌查询
    doFilter() {
      if (this.tableDataName == "") {
        this.$message.warning("查询条件不能为空！");
        return;
      }
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((value, index) => {
        if (value.nameCn) {
          if (value.nameCn.indexOf(this.tableDataName) >= 0) {
            this.filterTableDataEnd.push(value);
          }
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    openData() {},
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.tableDataEnd = this.numArr;
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.filterTableDataEnd = this.numArr;
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },

    // 加载china地点数据，三级
    getCityData: function() {
      var that = this;
      axios
        .get("static/map.json")
        .then(function(response) {
          if (response.status == 200) {
            var data = response.data;
            that.city.province = [];
            that.city.city = [];
            that.city.block = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                //省
                that.city.province.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else if (item.match(/00$/)) {
                //市
                that.city.city.push({
                  id: item,
                  value: data[item],
                  children: []
                });
              } else {
                //区
                that.city.block.push({ id: item, value: data[item] });
              }
            }
            // 分类市级
            for (var index in that.city.province) {
              for (var index1 in that.city.city) {
                if (
                  that.city.province[index].id.slice(0, 2) ===
                  that.city.city[index1].id.slice(0, 2)
                ) {
                  that.city.province[index].children.push(
                    that.city.city[index1]
                  );
                }
              }
            }
            // 分类区级
            for (var item1 in that.city.city) {
              for (var item2 in that.city.block) {
                if (
                  that.city.block[item2].id.slice(0, 4) ===
                  that.city.city[item1].id.slice(0, 4)
                ) {
                  that.city.city[item1].children.push(that.city.block[item2]);
                }
              }
            }
          } else {
            console.log(response.status);
          }
        })
        .catch(function(error) {
          console.log(typeof +error);
        });
    },
    // 选省
    choseProvince: function(e) {
      for (var index2 in this.city.province) {
        if (e === this.city.province[index2].value) {
          this.city.shi1 = this.city.province[index2].children;
          this.city.shi = this.city.province[index2].children[0].value;
          this.city.qu1 = this.city.province[index2].children[0].children;
          this.city.qu = this.city.province[
            index2
          ].children[0].children[0].value;
          this.city.E = this.city.qu1[0].id;
        }
      }
    },
    // 选市
    choseCity: function(e) {
      for (var index3 in this.city.city) {
        if (e === this.city.city[index3].value) {
          this.city.qu1 = this.city.city[index3].children;
          this.city.qu = this.city.city[index3].children[0].value;
          this.city.E = this.city.qu1[0].id;
          // console.log(this.E)
        }
      }
    },
    // 选区
    choseBlock: function(e) {
      this.city.E = e;
      // console.log(this.E)
    },
    // 详细地址
    addressBtn(city) {
      this.information.province = city.sheng;
      this.information.city = city.shi;
      this.information.district = city.qu;
    },

    // 品牌表格
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 点击选择品牌
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 国家
    getnationData() {
      let that = this;
      axios.get("static/nation.json").then(res => {
        this.nationData = res.data;
      });
    },
    // 新建品牌
    resFrombtn() {
      var re = new RegExp("^[a-zA-Z]+$");
      if(this.form.nameCn != "" || this.form.nameEn != "" ){
        if(this.form.nameEn != ""){
          if (!re.test(this.form.nameEn)) {
          this.$message.error("请输入纯英文名称");
          return;
        }  
      }}else{
        this.$message.error("中文名称或英文名称输入其一即可!")
        return;
      }

      if(this.formImg == "" || this.formImg == undefined) {
          this.$message.error("请上传品牌LOGO");
          return;
      }

      var timestamp = new Date().getTime();
      let genRandom = parseInt(Math.random() * (((99999 - 1 + 1) | 0) + 1))
      var key = 'merchant/'+ timestamp + genRandom + ".jpg"; 
      this.getTokenAndSubmit(key, () => {
        this.$refs.upload_idBack.submit();
      });
    },
    //点击取消新建品牌
    resultForm(form) {
      this.$refs.form.resetFields();
      this.$refs.upload_idBack.clearFiles();
      this.restForm.dialogFormVisible = false;
    },
    // 上一步
    onBack() {
      let information = JSON.stringify(this.information);
      localStorage.setItem("information", information);
      this.$router.push({ path: "/message" });
    },

    // 下一步
    onSubmit() {
          // setTimeout(
          //     function(){ 
          //       console.log(222222222222)
          //       this.disabled = true 
                
          //     }, 10000);
      if (this.information.logoImg == "") {
        this.$message.error("请上传店铺LOGO");
      } else if (this.information.licenceImg == "") {
        this.$message.error("请上传营业执照");
      } else if (this.information.categoryName.length == 0) {
        this.$message.error("请选择主营类目");
      } else if (this.information.brandName.length == 0) {
        this.$message.error("请选择经营品牌");
      }  else if (this.information.nickName == "") {
        this.$message.error("请输入店铺名称");
      } else if (this.information.email == "") {
        this.$message.error("请填写店铺邮箱");
      } else if (this.information.enterpriseName == "") {
        this.$message.error("请输入企业名称");
      } else if (this.information.addressDetail == "") {
        this.$message.error("请输入经营地址");
      } else if (this.information.bankNo == "") {
        this.$message.error("请输入银行账户");
      } else if (this.information.bankType == "") {
        this.$message.error("请输入开户行名称");
      } else if (this.information.bankImg == "") {
        this.$message.error("请上传开户许可证或者基本账户存款凭证");
      } else if (this.information.radio == "") {
        this.$message.error("请阅读胖球商家合作协议");
      } else if (
        this.information.logoImgUrl != "" &&
        this.information.licenceImgUrl != "" &&
        this.information.bankVouchersUrl != ""
      ) {
        //点击上传入驻信息
        this.disabled = true 
           if(this.information.brandWarrantImages.length == this.imageNum){
             this.skipSum()
           }else{
             this.$refs.upload_shou.submit();
           }
      } else {
         this.disabled = true
        if(this.imgStatus == 1){
          this.$refs.upload_shou.submit();
        }else{
          var timestamp = new Date().getTime();
          let genRandom = parseInt(Math.random() * (((99999 - 1 + 1) | 0) + 1))
          var key ='merchant/'+ timestamp + genRandom + ".jpg"; 
          this.getTokenAndSubmit(key, () => {
            this.$refs.upload_logo.submit(); 
          });
        }
      }
    },

    // 点击提交跳转
    skipSum(){
       //点击上传入驻信息
      let information = this.information;
      //赋值
      information.bankName = information.enterpriseName
      var list = {};
      list.params = information;
      this.$refs.information.validate(valid => {
        if (valid) {
          sellerInfo({
            params: {
              list
            }
          }).then(res => {
            var data = JSON.parse(res.data.result);
            if (data.code == 0) {
              localStorage.removeItem("userForm");
              localStorage.removeItem("loginForm");
              localStorage.removeItem("information");
              this.$refs.upload_logo.clearFiles();
              this.$refs.upload_licence.clearFiles();
              this.$refs.upload_bank.clearFiles();
              this.$refs.upload_shou.clearFiles();
              this.$refs.information.resetFields();
              this.$router.push({ path: "/successfully" });
              this.disabled = false 
            } else {
              this.disabled = false 
              this.$message.error(data.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
    }
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
              this.$refs.information.resetFields();
      }else{
        //页面刷新
        this.$refs.information.resetFields();
      } 

          
          }
        }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
@import "./infoData.css";
@import '../../style/style.css';
</style>