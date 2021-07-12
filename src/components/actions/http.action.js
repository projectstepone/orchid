import React, { useState } from 'react'

import { produce } from 'immer'

import { 
  Container, List, ListItem, Divider, Fab, Modal,
  TextField, Button, FormControlLabel, Checkbox, ListItemText,
  ListItemSecondaryAction, IconButton
} from '@material-ui/core'

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

import { makeStyles } from '@material-ui/core/styles'

const METHODS = [
  {
    "title": "POST"
  },
  {
    "title": "GET"
  }
]

const HttpAction = (props) => {

  const styles = useStyles()
  const { action, setAction, creating, updating } = props

  const onUrlChange = (event) => {
    setAction(produce(action, draftAction => {
      draftAction.url = event.target.value
    }))
  }

  const onMethodChange = (event, method) => {
    setAction(produce(action, draftAction => {
      draftAction.method = method.title
    }))
  }

  const onNoopChange = () => {
    setAction(produce(action, draftAction => {
      if (draftAction.noop == undefined) {
        draftAction.noop = true
      } else {
        draftAction.noop = !draftAction.noop
      }
    }))
  }

  const onPayloadChange = (event, payload) => {
    setAction(produce(action, draftAction => {
      draftAction.payload = payload
    }))
  }

  const onHeaderChange = (event, headers) => {
    setAction(produce(action, draftAction => {
      draftAction.headers = headers
    }))
  }

  const onResponseTranslatorChange = (event, responseTranslator) => {
    setAction(produce(action, draftAction => {
      draftAction.responseTranslator = responseTranslator
    }))
  }

  return (
    <>
      <TextField
        className={styles.textField}
        label={"Url"}
        value={action.url}
        onChange={onUrlChange}
        multiline
        disabled={creating || updating}
      />
      <Autocomplete
        id="http-action-auto"
        className={styles.textField}
        options={METHODS}
        getOptionLabel={option => option.title}
        renderInput={(params) => <TextField {...params} label="Method"/> }
        disabled={creating || updating}
        value={ action.method ? {
          title: action.method,
          value: action.method
        } : null }
        getOptionSelected={(option, value) => {
          return option.title === value.title
        }}
        onChange={onMethodChange}
      />
      <FormControlLabel
        className={styles.textField}
        control={
          <Checkbox
            checked={action.noop}
            name="active_checkbox"
            color="secondary"
            disabled={creating || updating}
            onChange={onNoopChange}
          />
        }
        label="Noop"
      />
      <TextField
        className={styles.textField}
        label={"Headers"}
        value={action.headers}
        onChange={onHeaderChange}
        multiline
        disabled={creating || updating}
      />
      <TextField
        className={styles.textField}
        label={"Payload"}
        value={action.payload}
        onChange={onPayloadChange}
        multiline
        disabled={creating || updating}
      />
      <TextField
        className={styles.textField}
        label={"Response Translator"}
        value={action.responseTranslator}
        onChange={onResponseTranslatorChange}
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

export default HttpAction