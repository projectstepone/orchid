import { produce } from 'immer'
import * as AuthTypes from './auth.types'


const initialState = {
  isLoggedIn: true  
}

const authSuccess = (state, action) => {
  return produce(state, draft => {
    draft.isLoggedIn = true
  })
}

const logout = (state, action) => {
  return produce(state, draft => {
    draft.isLoggedIn = false
  })
}

const handlers = {
  [AuthTypes.AUTH_SUCCESS]: authSuccess,
  [AuthTypes.LOGOUT]: logout
}

export default (state = initialState, action) => {
  console.log("[auth][actions]", action)
  const handler = handlers[action.type]
  if(handler) {
    const nextState = handler(state, action)
    console.log("authNextState", nextState)
    return nextState
  }
  return state
}