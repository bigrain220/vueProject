import request from '@/utils/request'

export function getCategoryOptions() {
  return request({
    url: '/merchant/getCategoryOptions',
    method: 'get',
  })
}

export function getList(params) {
  return request({
    url: '/merchant/getList',
    method: 'get',
    params,
  })
}

export function doEdit(data) {
  return request({
    url: '/merchant/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/merchant/doSign',
    method: 'post',
    data,
  })
}

export function doExportExcel(params) {
  return request({
    url: '/merchant/doExportExcel',
    method: 'get',
    params,
  })
}
