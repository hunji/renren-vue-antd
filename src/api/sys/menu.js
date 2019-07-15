import { axios } from '@/utils/request'

export function getMenuList () {
  return axios({
    url: '/sys/menu/list',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function selectMenu () {
  return axios({
    url: '/sys/menu/select',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function saveMenu (parameter) {
  return axios({
    url: '/sys/menu/save',
    method: 'post',
    data: parameter
  })
}

export function updateMenu (parameter) {
  return axios({
    url: '/sys/menu/update',
    method: 'post',
    data: parameter
  })
}

export function getMenuInfo (id) {
  return axios({
    url: `/sys/menu/info/${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function deleteMenu (id) {
  return axios({
    url: `/sys/menu/delete/${id}`,
    method: 'post'
  })
}
