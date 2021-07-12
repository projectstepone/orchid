import React, { useState } from 'react'

import { produce } from 'immer'

import { 
  Container, List, ListItem, Divider, Fab, Modal,
  TextField, Button, FormControlLabel, Checkbox, ListItemText,
  ListItemSecondaryAction, IconButton
} from '@material-ui/core'

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

import { makeStyles } from '@material-ui/core/styles'

const TranslatorAction = (props) => {

  const styles = useStyles()
  const { action, setAction, creating, updating } = props

  const onTranslatorChange = (event, value) => {
    setAction(produce(action, draftAction => {
      draftAction.translator = value
    }))
  }

  return (
    <>
      <TextField
        className={styles.textField}
        label={"Translator"}
        value={action.translator}
        onChange={onTranslatorChange}
        multiline
        disabled={creating || updating}
      />
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: 'black',
    flex: 1,
    height: '100%',
    paddingTop: 12,
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    "marginTop": theme.spacing(1),
    width: '100%'
  }
}))


export default TranslatorAction