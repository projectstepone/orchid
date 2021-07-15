import { authSuccess, logout } from './auth.actions'

const autoLogoutStatus = [401]

export const authMiddleware = (store) => (next) => (action) => {
  const type = action.type
  if (type.includes("COMPLETED")) {
    const isLoggedIn = store.getState().auth.isLoggedIn
    console.log("Logging in user")
    if (!isLoggedIn) {
      store.dispatch(authSuccess())
    }
  }
  if (type.includes("FAILED")) {
    if (!action.payload) {
      return
    }
    const  { err } = action.payload
    if (!err) {
      return
    }
    const status = err.response.status
    if (autoLogoutStatus.indexOf(status) !== -1) {
      console.log("Logging out user")
      store.dispatch(logout())
    }
  }
  next(action)
}