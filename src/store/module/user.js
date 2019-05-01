import { setToken, getToken } from '@/libs/util'
import { post } from '@/libs/axios-cfg'
import {errorHandler} from '@/libs/iview-cfg'
export default {
  state: {
    userName: '',
    userId: '',
    aparId:'',
    stuId:'',
    avatorImgPath: '',
    token: getToken(),
    access: ''
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, userName) {
      state.userName = userName
    },
    setAparId (state, aparId) {
      state.aparId = aparId
    },
    setStuId (state, stuId) {
      state.stuId = stuId
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
   actions: {
    // 退出登录
    handleLogOut ({ state, commit }) {
      commit('setToken', '')
      commit('setAccess', [])
      localStorage.clear()
    },
    // 获取用户相关信息
    async getUserInfo ({ state, commit }) {
      try {
          let res = await post('/account/all-permission-tag')
          commit('setAccess', res.data)
          let resp = await post('/account/current')
          commit('setUserId', resp.data.id);
          commit('setUserName', resp.data.username);
          commit('setAparId', resp.data.aparId);
          commit('setStuId',resp.data.stuId);
          return {access:res.data}
      } catch (error) {
        errorHandler(error)
      }
      
    }
  } 
}
