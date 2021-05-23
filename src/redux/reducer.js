import { combineReducers } from 'redux'
import storageUtils from '../utils/storageUtils'

import {
  GET_USER,
  CLEAR_USER,
  ERROR_MSG,
  SET_TITLE,
} from './action-types'

function user(state = storageUtils.getUser(), action){
  switch(action.type) {
    case GET_USER:
      return action.user
    case ERROR_MSG:
      const errorMsg = action.errorMsg
      return {...state, errorMsg}
    case CLEAR_USER:
      return {}
    default:
      return state
  }
}

function headTitle(state = 'Dashboard', action){
  switch(action.type) {
    case SET_TITLE:
      return action.data
    default:
      return state
  }
}

export default combineReducers({
  user,
  headTitle,
})