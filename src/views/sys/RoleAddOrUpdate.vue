<template>
  <a-modal
    :title="!id ? '新增角色' : '修改角色'"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="角色名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'roleName',
            {rules: [{ required: true, message: '角色名称不能为空' }]}
          ]"
          name="roleName"
          placeholder="角色名称" />
      </a-form-item>
      <a-form-item
        label="备注"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          name="remark"
          placeholder="备注"
          v-decorator="['remark']"/>
      </a-form-item>
      <a-form-item
        label="授权"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-tree
          ref="menuList"
          checkable
          v-model="menuChecked"
          @check="onCheck"
          :treeData="menuList"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { getMenuList } from '@/api/sys/menu'
import { getRoleInfo, saveRole, updateRole } from '@/api/sys/role'
import { treeDataTranslate } from '@/utils/util'

export default {
  name: 'RoleForm',
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
      menuList: [],
      menuChecked: [],
      id: 0
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.id = id || 0
      getMenuList().then(data => {
        this.menuList = treeDataTranslate(data, 'menuId')
      }).then(() => {
        this.$nextTick(() => {
          this.form.resetFields()
          this.menuChecked = []
        })
      }).then(() => {
        if (this.id) {
          getRoleInfo(id).then(data => {
            if (data && data.code === 200) {
              this.form.setFieldsValue({
                roleName: data.role.roleName,
                remark: data.role.remark
              })
              // 这里个checkboxgroup直接赋值会报错，转为赋值给initialvalue
              this.menuChecked = data.role.menuIdList
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
          // 将menu树作为参数与表单的参数合并在一起
          Object.assign(values, { menuIdList: this.menuChecked, roleId: this.id })
          // 这里把新增和修改分开进行了处理：因为api中为两个地址
          let promise
          if (this.id) {
            promise = updateRole(values)
          } else {
            promise = saveRole(values)
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
        this.confirmLoading = false
      })
    },
    handleCancel () {
      this.visible = false
    },
    onCheck (checkedKeys, info) {
      this.menuChecked = checkedKeys
    }
  }
}
</script>
