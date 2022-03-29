/**
 * Created by gch on 30/05/19.
 */

export function projStatusOpinion() {
  const statusOpinion = [
    {
      key: 'declare_draft',
      value: '草稿'
    }, {
      key: 'first_trial',
      value: '待初审'
    }, {
      key: 'first_trial_rejected',
      value: '初审审核不通过'
    }, {
      key: 'pending_group_allot',
      value: '待分组'
    }, {
      key: 'pending_zj_allot',
      value: '专家评审中'
    }, {
      key: 'last_trial',
      value: '待终审'
    }, {
      key: 'last_trial_rejected',
      value: '终审审核不通过'
    }, {
      key: 'project_contract_pending',
      value: '合同待填写'
    }, {
      key: 'project_contract_trial',
      value: '合同待审核'
    }, {
      key: 'project_contract_rejected',
      value: '合同审核不通过'
    }, {
      key: 'processing',
      value: '执行中'
    }, {
      key: 'cancelled',
      value: '已取消'
    }
  ]
  return statusOpinion
}

export function projStatusFilter(status) {
  const statusMap = {
    'declare_draft': '草稿',
    'first_trial': '待初审',
    'first_trial_rejected': '初审审核不通过',
    'pending_group_allot': '待分组',
    'pending_zj_allot': ' 专家评审中',
    'last_trial': '待终审',
    'last_trial_rejected': '终审审核不通过',
    'project_contract_pending': '合同待填写',
    'project_contract_trial': '合同待审核',
    'project_contract_rejected': '合同审核不通过',
    'processing': '执行中',
    'cancelled': '已取消'
  }
  return statusMap[status]
}

export function contractStatusFilter(status) {
  const statusMap = {
    '1': '草稿',
    '2': '待审核',
    '3': '审核不通过',
    '4': '审核通过'
  }
  return statusMap[status]
}
