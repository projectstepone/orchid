import * as AuthTypes from './auth.types'

export const authSuccess = () => {
  return {
    "type": AuthTypes.AUTH_SUCCESS
  }
}

export const logout = () => {
  return {
    "type": AuthTypes.LOGOUT
  }
}