import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom"

import { useSelector } from 'react-redux'

const LOGIN_PATH = process.env.REACT_APP_ORCHID_HOST + "/login"

function PrivateRoute({ children, ...rest }) {
  const history = useHistory()
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  if (!isLoggedIn) {
    window.location.href = LOGIN_PATH
    return null
  }
  return (
    <Route
      forceRefresh={true}
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute