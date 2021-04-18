import React, { 
  createContext,
  useState,
  useMemo
} from 'react'

const SnackbarContext = createContext(null)

const SnackbarProvider = (props) => {

  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("");

  const showSuccess = (message) => {
    setError(false)
    setOpen(true)
    setMessage(message)
  }

  const showSuccessCallback = React.useCallback(showSuccess, [])

  const showError = (message) => {
    setError(true)
    setOpen(true)
    setMessage(message)
  }

  const showErrorCallback = React.useCallback(showError, [])

  const hide = () => {
    setOpen(false)
    setError(false)
    setMessage("")
  }

  const hideCallback = React.useCallback(hide, [])

  const value = useMemo(() => ({
    open,
    error,
    message,
    showSuccess: showSuccessCallback,
    showError: showErrorCallback,
    hide: hideCallback
  }), [open, error, message, showSuccessCallback, showErrorCallback, hideCallback])

  return (
    <SnackbarContext.Provider value={value}>
      {props.children}
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider;

export {
  SnackbarContext
}
