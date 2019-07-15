<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createModal.init()">新建</a-button>
    </div>
    <a-table ref="table" :columns="columns" :dataSource="data" :bordered="true" :pagination="false">
      <span slot="icon" slot-scope="text">
        <a-icon v-if="text !== ''" :type="text" />
      </span>
      <span slot="status" slot-scope="text">
        <a-tag v-if="text === 0" size="small">目录</a-tag>
        <a-tag v-else-if="text === 1" size="small" type="success">菜单</a-tag>
        <a-tag v-else-if="text === 2" size="small" type="info">按钮</a-tag>
      </span>
      <span slot="url" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="perms" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="$refs.createModal.init(record.menuId)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.menuId)">删除</a>
        </template>
      </span>
    </a-table>
    <menu-add-or-update ref="createModal" @ok="handleOk" ></menu-add-or-update>
  </a-card>
</template>

<script>
import { getMenuList, deleteMenu } from '@/api/sys/menu'
import { Ellipsis } from '@/components'
import { treeDataTranslate } from '@/utils/util'
import MenuAddOrUpdate from './MenuAddOrUpdate'

export default {
  name: 'MenuList',
  components: {
    Ellipsis,
    MenuAddOrUpdate
  },
  data () {
    return {
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'left'
        },
        {
          title: '上级菜单',
          dataIndex: 'parentName',
          align: 'left'
        },
        {
          title: '图标',
          dataIndex: 'icon',
          align: 'center',
          scopedSlots: { customRender: 'icon' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序号',
          dataIndex: 'orderNum',
          align: 'center'
        },
        {
          title: '菜单URL',
          dataIndex: 'url',
          align: 'center',
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '授权标识',
          dataIndex: 'perms',
          align: 'center',
          scopedSlots: { customRender: 'perms' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      data: []
    }
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      getMenuList().then(data => { this.data = treeDataTranslate(data, 'menuId') })
    },
    handleOk () {
      this.getDataList()
    },
    // 删除操作，把批量和单个删除合并成一个
    handleDelete (id) {
      this.$confirm({
        title: '确定进行删除吗？',
        onOk: () => {
          deleteMenu(id).then(data => {
            if (data && data.code === 200) {
              this.$message.success('操作成功', 1,
                () => {
                  this.getDataList()
                }
              )
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>
