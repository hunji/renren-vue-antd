import { axios } from '@/utils/request'

export function getUserList (parameter) {
  return axios({
    url: '/sys/user/list',
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function deleteUser (parameter) {
  return axios({
    url: '/sys/user/delete',
    method: 'post',
    data: parameter
  })
}

export function getRoleList () {
  return axios({
    url: '/sys/role/select',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getUserInfo (id) {
  return axios({
    url: `/sys/user/info/${id}`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function saveUser (parameter) {
  return axios({
    url: '/sys/user/save',
    method: 'post',
    data: parameter
  })
}

export function updateUser (parameter) {
  return axios({
    url: '/sys/user/update',
    method: 'post',
    data: parameter
  })
}
