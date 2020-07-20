<template>
  <div>
    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
      <a-form-item label="用户名">
        <a-input v-decorator="['userName', { rules: [{ required: true, message: '请输入用户名' }] }]" />
      </a-form-item>
      <a-form-item label="昵称">
        <a-input v-decorator="['nick', { rules: [{ required: true, message: '请输入昵称' }] }]" />
      </a-form-item>
      <a-form-item label="密码">
        <a-input v-decorator="['passWord', { rules: [{ required: true, message: '请输入密码' }] }]" />
      </a-form-item>
      <a-form-item label="头像">
        <a-upload
                v-decorator="['avatarUrl', { rules: [{ required: true, message: '请输入头像' }] }]"
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :before-upload="beforeUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="img"/>
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          Submit
        </a-button>
      </a-form-item>
    </a-form>

    <a-button @click="upload" :disabled="!file">upload</a-button>
  </div>
</template>

<script>
import { register } from '../../api/account'
import { getUploadToken } from '../../api/file'
import * as qiniu from 'qiniu-js'
const baseUrl = 'http://qacynx4f4.bkt.clouddn.com/'
import { Modal } from 'ant-design-vue'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, {name: 'coordinated'}),
      loading: false,
      imageUrl: '',
      file: null
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, values) => {
        console.log(values);
        if (!err) {
          const avatarUrl = await this.upload()
          await register(Object.assign({}, values, { avatarUrl }))
          this.$message.success('注册成功');
        }
      });
    },
    async upload() {
      const type = this.file.type.split('/')[1]
      const uploadData = await getUploadToken(type)
      return new Promise(async (resolve, rej) => {
        let observable = qiniu.upload(this.file, uploadData.key, uploadData.token)
        observable.subscribe(function (e) {
          console.log(e);
        }, function (e) {
          console.log(e);
          Modal.error({
            title: '头像上传失败',
            content: '头像上传失败',
          });
          rej(e)
        }, function (res) {
          console.log(res);
          resolve(res.key)
        })
      })
    },
    beforeUpload(file) {
      this.file = file;
      getBase64(file, (e) => {
        this.imageUrl = e
      })
      return false;
    },
  },
};
</script>

<style scoped>
  .img {
    width: 300px;
    height: 300px;
  }
</style>
