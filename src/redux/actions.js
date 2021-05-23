import {
  GET_USER,
  CLEAR_USER,
  ERROR_MSG,
  SET_TITLE,
} from './action-types'
import {reqLogin} from '../request'
import storageUtils from '../utils/storageUtils'

export const login = (username,password) => {
  return async dispatch => {
    const result = await reqLogin(username, password)  
    if (result.status === 0){
      const user = result.data
      storageUtils.saveUser(user)
      dispatch(receiveUser(user))
    }
    const msg = result.msg
    dispatch(showErrorMsg(msg))
  }
}

export const logout = () => {
  storageUtils.removeUser()
  return {type: CLEAR_USER}
}

export const receiveUser = (user) => ({type: GET_USER, user})
export const setTitle = (headTitle) => ({type: SET_TITLE, data: headTitle})
export const showErrorMsg = (errorMsg) => ({type: ERROR_MSG,errorMsg})
