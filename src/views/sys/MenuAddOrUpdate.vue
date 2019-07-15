<template>
  <a-modal
    :title="!menuId ? '新增' : '修改'"
    :visible="visible"
    :width="640"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item label="类型" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group
          v-model="type">
          <a-radio v-for="(temptype, index) in typeList" :value="index" :key="index">{{ temptype }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :label="typeList[type] + '名称'"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '菜单名称不能为空' }]}
          ]"
          :placeholder="typeList[type] + '名称'"></a-input>
      </a-form-item>
      <a-form-item
        label="上级菜单"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-tree-select
          :treeData="menuList"
          placeholder="点击选择上级菜单"
          treeDefaultExpandAll
          :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
          v-model="parentId"
          @select="onSelect">
          <span style="color: #08c" slot="title" slot-scope="{key, value}">
            {{ value }}
          </span>
        </a-tree-select>
      </a-form-item>
      <a-form-item
        v-if="type === 1"
        label="菜单路由"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-input
          v-decorator="[
            'url',
            {rules: [{ required: true, message: '菜单路由不能为空' }]}
          ]"
          placeholder="菜单路由"></a-input>
      </a-form-item>
      <a-form-item
        v-if="type !== 0"
        label="授权标识"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-input v-decorator="['perms']" placeholder="多个用逗号分隔, 如: user:list,user:create"></a-input>
      </a-form-item>
      <a-form-item
        v-if="type !== 2"
        label="排序号"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-input-number :min="0" v-decorator="['orderNum']"/>
      </a-form-item>
      <a-form-item
        v-if="type !== 2"
        label="菜单图标"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="24">
            <a-popover
              title="图标选择器"
              trigger="click"
              v-model="iconSelectVisiable"
            >
              <icon-selector @change="handleIconChange" slot="content"/>
              <a-input v-decorator="['icon']" placeholder="菜单图标名称"></a-input>
            </a-popover>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item
        v-if="type !== 2"
        label="动态路由专用"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-input v-decorator="['component']" placeholder="component(可不填)"></a-input>
      </a-form-item>
      <a-form-item
        v-if="type !== 2"
        label="动态路由专用"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-input v-decorator="['rkey']" placeholder="rkey(可不填)"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { selectMenu, saveMenu, updateMenu, getMenuInfo } from '@/api/sys/menu'
import { treeDataTranslate } from '@/utils/util'
import IconSelector from '@/components/IconSelector'

export default {
  name: 'MenuForm',
  components: {
    IconSelector
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      confirmLoading: false,
      // form
      form: this.$form.createForm(this),
      menuId: 0,
      type: 1,
      typeList: ['目录', '菜单', '按钮'],
      name: '',
      // value(v-model)	指定当前选中的条目	string/string[]
      // 目前这个控件的value只能支持string类型
      parentId: 0 + '',
      parentName: '',
      url: '',
      perms: '',
      orderNum: 0,
      icon: '',
      component: '',
      rkey: '',
      visible: false,
      menuList: [],
      iconSelectVisiable: false
    }
  },
  methods: {
    init (menuId) {
      this.visible = true
      this.menuId = menuId || 0
      selectMenu().then(data => {
        this.menuList = treeDataTranslate(data.menuList, 'menuId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.form.resetFields()
        })
      }).then(() => {
        if (menuId) {
          getMenuInfo(menuId).then(data => {
            if (data && data.code === 200) {
              this.form.setFieldsValue({
                'name': data.menu.name,
                'component': data.menu.component,
                'icon': data.menu.icon,
                'orderNum': data.menu.orderNum,
                'perms': data.menu.perms,
                'rkey': data.menu.rkey,
                'url': data.menu.url
              })
              this.menuId = data.menu.menuId
              this.type = data.menu.type
              this.parentId = data.menu.parentId + ''
            }
          })
        }
      })
    },
    handleSubmit (e) {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((err, values) => {
        if (!err) {
          Object.assign(values, { menuId: this.menuId, type: this.type, parentId: this.parentId })
          // 这里把新增和修改分开进行了处理：因为api中为两个地址
          let promise
          if (this.menuId) {
            promise = updateMenu(values)
          } else {
            promise = saveMenu(values)
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
    onSelect (value, node, extra) {
      this.parentId = value
    },
    handleIconChange (icon) {
      this.iconSelectVisiable = false
      this.form.setFieldsValue({
        'icon': icon
      })
    }
  }
}
</script>
