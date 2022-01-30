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
      next(action)
      return
    }
    const  { err } = action.payload
    if (!err) {
      next(action)
      return
    }
    const status = err.response ? err.response.status : -1
    if (autoLogoutStatus.indexOf(status) !== -1) {
      console.log("Logging out user")
      store.dispatch(logout())
    }
  }
  next(action)
}