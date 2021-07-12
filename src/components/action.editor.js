import React, { useState, useEffect } from 'react'
import { produce } from 'immer'
import {
  Link,
  useRouteMatch
} from 'react-router-dom'

import { 
  Container, List, ListItem, Divider, Fab, Modal,
  TextField, Button, FormControlLabel, Checkbox,
  ListItemText, ListItemSecondaryAction, IconButton,
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add'

import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'
// custom components

import {
  HttpAction,
  CompoundAction,
  EvaluatedAction,
  RoutedAction,
  TranslatorAction
} from '../components/actions'

const DEFAULT_WORKFLOW_ACTION = {
  "templateId": "",
  "name": "",
  "active": false,
  "type": "HTTP"
}

const ACTION_TYPES = [
{
  "title": "HTTP",
  "value": "HTTP",
},
{
  "title": "COMPOUND",
  "value": "COMPOUND"
},
{
  "title": "ROUTED",
  "value": "ROUTED"
},
{
  "title": "EVALUATED",
  "value": "EVALUATED"
},
{
  "title": "TRANSLATOR",
  "value": "TRANSLATOR"
}]

const filter = createFilterOptions()

const ActionEditor = (props) => {

  const styles = useStyles()
  const { action, setAction, actionTemplates, updating, creating } = props

  const onActionTypeChange = (event, newActionType) => {
    if (newActionType == null) {
      return
    }
    setAction(produce(DEFAULT_WORKFLOW_ACTION, draftAction => {
      draftAction.type = newActionType.title
    }))
  }

  const onActionIdChange = (event, actionId) => {
    setAction(produce(action, draftAction => {
      draftAction.templateId = event.target.value
    }))
  }

  const onNameChange = (event, newName) => {
    setAction(produce(action, draftAction => {
      draftAction.name = event.target.value
    }))
  }

  const onActiveChange = () => {
    setAction(produce(action, draftAction => {
      draftAction.active = !draftAction.active
    }))
  }

  return (
    <>
      <h3>Workflow Action</h3>
      <Autocomplete
        id="action-type-auto"
        className={styles.textField}
        options={ACTION_TYPES}
        getOptionLabel={option => option.title}
        renderInput={(params) => <TextField {...params} label="Type"/> }
        disabled={ creating || updating }
        value={{
          title: action.type,
          value: action.type
        }}
        getOptionSelected={(option, value) => {
          return option.title === value.title
        }}
        onChange={onActionTypeChange}
      />
      <TextField
        className={styles.textField}
        label={"Name"}
        value={action.name}
        disabled={creating || updating}
        onChange={onNameChange}
      />
      <TextField
        className={styles.textField}
        label={"Id"}
        value={action.templateId}
        disabled={ creating || updating }
        onChange={onActionIdChange}
      />
      <FormControlLabel
        className={styles.textField}
        control={
          <Checkbox
            checked={action.active}
            name="active_checkbox"
            color="secondary"
            disabled={creating || updating}
            onChange={onActiveChange}
          />
        }
        label="Active"
      />
      { action.type === 'HTTP' && <HttpAction action={action} setAction={setAction} updating={updating} creating={creating} /> }
      { action.type === 'COMPOUND' && <CompoundAction action={action} setAction={setAction} actionTemplates={actionTemplates} updating={updating} creating={creating}/> }
      { action.type === 'ROUTED' && <RoutedAction action={action} setAction={setAction} updating={updating} creating={creating}/> }
      { action.type === 'EVALUATED' && <EvaluatedAction action={action} setAction={setAction} updating={updating} creating={creating} /> }
      { action.type === 'TRANSLATOR' && <TranslatorAction action={action} setAction={setAction} updating={updating} creating={creating} /> }
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
    marginTop: theme.spacing(1),
    width: '100%'
  },
  button: {
    "marginTop": theme.spacing(1),
    width: 100
  }
}))

export default ActionEditor