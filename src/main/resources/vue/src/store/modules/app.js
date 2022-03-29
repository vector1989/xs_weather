import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      systemLogoClass: 'systemLogo',
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false,
      systemName: '基础注册'
    },
    searchOperator: [{
      value: 'EQ',
      label: '等于'
    }, {
      value: 'NEQ',
      label: '不等于'
    }, {
      value: 'GTE',
      label: '大于等于'
    }, {
      value: 'LTE',
      label: '小于等于'
    }, {
      value: 'LIKE',
      label: '包含'
    }, {
      value: 'NLIKE',
      label: '不包含'
    }, {
      value: 'IN',
      label: '包含其中一个'
    }],
    device: 'desktop',
    language: Cookies.get('language') || 'zh',
    size: Cookies.get('size') || 'Small',
    userInfoDialogVisible: false,
    passwordChangeDialogVisible: false,
    logoutConfirmDialogVisible: false
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
        state.sidebar.systemLogoClass = 'systemLogo-small'
      } else {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.systemLogoClass = 'systemLogo'
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    SET_SYSTEM_NAME: (state, systemName) => {
      state.sidebar.systemName = systemName
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    },
    TOGGLE_USER_INFO_DIALOG: state => {
      if (state.userInfoDialogVisible) {
        state.userInfoDialogVisible = false
      } else {
        state.userInfoDialogVisible = true
      }
    },
    TOGGLE_PASSWORD_CHANGE_DIALOG: state => {
      if (state.passwordChangeDialogVisible) {
        state.passwordChangeDialogVisible = false
      } else {
        state.passwordChangeDialogVisible = true
      }
    },
    TOGGLE_LOGOUT_CONFIRM_DIALOG: state => {
      if (state.logoutConfirmDialogVisible) {
        state.logoutConfirmDialogVisible = false
      } else {
        state.logoutConfirmDialogVisible = true
      }
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    setSystemName({ commit }, systemName) {
      commit('SET_SYSTEM_NAME', systemName)
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    },
    toggleUserInfoDialog({ commit }) {
      commit('TOGGLE_USER_INFO_DIALOG')
    },
    togglePasswordChangeDialog({ commit }) {
      commit('TOGGLE_PASSWORD_CHANGE_DIALOG')
    },
    toggleLogoutConfirmDialog({ commit }) {
      commit('TOGGLE_LOGOUT_CONFIRM_DIALOG')
    }
  }
}

export default app
