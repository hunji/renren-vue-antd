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
