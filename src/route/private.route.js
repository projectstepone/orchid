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

function PrivateRoute({ children, ...rest }) {
  const history = useHistory()
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  if (!isLoggedIn) {
    window.location.href = "https://592a5ede94d2.ngrok.io/login"
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