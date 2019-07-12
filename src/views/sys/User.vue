<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名">
              <a-input v-model="queryParam.username" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input v-model="queryParam.phone" placeholder=""/>
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
      rowKey="userId"
      :columns="columns"
      :data="loadData"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="status" slot-scope="text">
        <a-tag color="cyan" v-if="text === 0" size="small" type="danger">禁用</a-tag>
        <a-tag color="green" v-else size="small">正常</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.createModal.init(record.userId)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.userId)">删除</a>
        </template>
      </span>
    </s-table>
    <user-add-or-update ref="createModal" @ok="handleOk" ></user-add-or-update>
  </a-card>
</template>

<script>
import { getUserList, deleteUser } from '@/api/sys/user'
import { STable } from '@/components'
import UserAddOrUpdate from './UserAddOrUpdate'

export default {
  name: 'UserList',
  components: {
    STable,
    UserAddOrUpdate
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
          title: '用户名',
          dataIndex: 'username',
          align: 'center'
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          align: 'center'
        },
        {
          title: '实际姓名',
          dataIndex: 'realName',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center',
          scopedSlots: { customRender: 'status' }
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
        return getUserList(Object.assign(parameter, this.queryParam))
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
      const userIds = id ? [id] : this.selectedRowKeys
      this.$confirm({
        title: '确定进行删除吗？',
        content: '删除前请先清除用户的角色信息',
        onOk: () => {
          deleteUser(userIds).then(data => {
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
      this.$refs.table.refresh()
    }
  }
}
</script>
