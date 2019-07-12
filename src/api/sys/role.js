import { axios } from '@/utils/request'

export function getRoleList (parameter) {
  return axios({
    url: '/sys/role/list',
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function deleteRole (parameter) {
  return axios({
    url: '/sys/role/delete',
    method: 'post',
    data: parameter
  })
}

export function getRoleInfo (id) {
  return axios({
    url: `/sys/role/info/${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function saveRole (parameter) {
  return axios({
    url: '/sys/role/save',
    method: 'post',
    data: parameter
  })
}

export function updateRole (parameter) {
  return axios({
    url: '/sys/role/update',
    method: 'post',
    data: parameter
  })
}
