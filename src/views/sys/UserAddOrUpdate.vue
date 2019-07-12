<template>
  <a-modal
    :title="!id ? '新增用户' : '修改用户'"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="用户名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '账号不能为空' }]}
          ]"
          name="username"
          placeholder="登录帐号" />
      </a-form-item>
      <a-form-item
        label="密码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: '请输入密码！' }, { min: 6, message: '密码不少于6位'}] }
          ]"
          type="password"
          placeholder="密码"
        />
      </a-form-item>
      <a-form-item
        label="手机号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          name="mobile"
          placeholder="手机号"
          v-decorator="['mobile']"/>
      </a-form-item>
      <a-form-item
        label="邮箱"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          name="email"
          placeholder="邮箱地址"
          v-decorator="[
            'email',
            {
              rules: [{
                type: 'email', message: 'Email格式错误',
              }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        label="实际姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          placeholder="实际姓名"
          v-decorator="[
            'realName',
            {rules: [{ required: true, message: '请输入你的实际姓名' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="角色"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-checkbox-group name="roleIdList" v-decorator="['roleIdList',{initialValue: roleChecked}]">
          <a-checkbox v-for="role in roleList" :key="role.roleId" :value="role.roleId">{{ role.roleName }}</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        label="状态"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-radio-group name="status" v-decorator="['status', {initialValue: 1}]" >
          <a-radio :value="0">禁用</a-radio>
          <a-radio :value="1">正常</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getRoleList, saveUser, getUserInfo, updateUser } from '@/api/sys/user'

export default {
  name: 'UserForm',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      },
      confirmLoading: false,
      // form
      form: this.$form.createForm(this),
      visible: false,
      roleList: [],
      roleChecked: [],
      id: 0
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.id = id || 0
      getRoleList().then(data => {
        this.roleList = data && data.code === 200 ? data.list : []
      }).then(() => {
        this.$nextTick(() => {
          this.form.resetFields()
        })
      }).then(() => {
        if (this.id) {
          getUserInfo(id).then(data => {
            if (data && data.code === 200) {
              this.form.setFieldsValue({
                username: data.user.username,
                mobile: data.user.mobile,
                email: data.user.email,
                realName: data.user.realName,
                status: data.user.status
              })
              // 这里个checkboxgroup直接赋值会报错，转为赋值给initialvalue
              this.roleChecked = data.user.roleIdList
            }
          })
        }
      })
    },
    // handler
    handleSubmit (e) {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((err, values) => {
        if (!err) {
          Object.assign(values, { userId: this.id })
          // 这里把新增和修改分开进行了处理：因为api中为两个地址
          let promise
          if (this.id) {
            promise = updateUser(values)
          } else {
            promise = saveUser(values)
          }
          promise.then(data => {
            if (data && data.code === 200) {
              this.$message.success('操作成功', 1,
                () => {
                  this.visible = false
                  this.$emit('ok')
                }
              )
            } else {
              this.$message.error(data.msg)
            }
          })
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>
