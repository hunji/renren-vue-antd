<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="16" :sm="24">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.roleName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" style="float:right ">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createModal.init()">新建</a-button>
      <a-button type="danger" :disabled="selectedRowKeys.length <= 0" @click="handleDelete()">批量删除</a-button>
    </div>

    <s-table
      :bordered="true"
      ref="table"
      size="default"
      rowKey="roleId"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.createModal.init(record.roleId)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.roleId)">删除</a>
        </template>
      </span>
    </s-table>
    <role-add-or-update ref="createModal" @ok="handleOk" ></role-add-or-update>
  </a-card>
</template>

<script>
import { getRoleList, deleteRole } from '@/api/sys/role'
import { STable } from '@/components'
import RoleAddOrUpdate from './RoleAddOrUpdate'

export default {
  name: 'RoleList',
  components: {
    STable,
    RoleAddOrUpdate
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
          align: 'center'
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        console.log(Object.assign(parameter, this.queryParam))
        return getRoleList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.page
          })
      },
      selectedRowKeys: []
    }
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 删除操作，把批量和单个删除合并成一个
    handleDelete (id) {
      const roleIds = id ? [id] : this.selectedRowKeys
      this.$confirm({
        title: '确定进行删除吗？',
        content: '删除前请先取消关联用户信息',
        onOk: () => {
          deleteRole(roleIds).then(data => {
            if (data && data.code === 200) {
              this.$message.success('操作成功', 1,
                () => {
                  this.$refs.table.refresh()
                }
              )
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        onCancel () {}
      })
    },
    handleOk () {
      debugger
      this.$refs.table.refresh()
    }
  }
}
</script>
