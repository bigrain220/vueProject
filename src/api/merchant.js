import request from '@/utils/request'

export function getCategoryOptions() {
  return request({
    url: '/merchant/getCategoryOptions',
    method: 'post',
  })
}

export function getList(data) {
  return request({
    url: '/merchant/getList',
    method: 'post',
    data,
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

export function doExportExcel(data) {
  return request({
    url: '/merchant/doExportExcel',
    method: 'post',
    data,
  })
}
