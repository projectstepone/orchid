import React from 'react'

import { 
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';

import clsx from 'clsx';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';

import { 
  IconButton,
  Snackbar ,
  SnackbarContent
} from '@material-ui/core';

import { SnackbarContext } from './SnackbarProvider'

const useStyles = makeStyles((theme) =>
  createStyles({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    }
  }),
);

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const OSnackbar = (props) => {
  const classes = useStyles()
  const snackbarValue = React.useContext(SnackbarContext)
  const { open, message, hide } = snackbarValue
  let variant = 'success'
  if (snackbarValue.error) {
    variant = 'error'
  }
  if (!open) {
    return null;
  }
  const Icon = variantIcon[variant]
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={hide}
      >
        <SnackbarContent
          className={clsx(classes[variant])}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {message}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={hide}>
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    )
}

export default OSnackbar;
