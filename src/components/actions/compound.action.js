import React, { useState } from 'react'

import { produce } from 'immer'

import { 
  Container, List, ListItem, Divider, Fab, Modal,
  TextField, Button, FormControlLabel, Checkbox, ListItemText,
  ListItemSecondaryAction, IconButton
} from '@material-ui/core'

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

import { makeStyles } from '@material-ui/core/styles'

const CompoundAction = (props) => {

  const styles = useStyles()
  const { action, setAction, actionTemplates, creating, updating } = props

  const onActionTemplateChange = (event, actionTemplateValues) => {
    setAction(produce(action, draftAction => {
      draftAction.actionTemplates = actionTemplateValues.map(actionTemplateValue => actionTemplateValue.title)
    }))
  }

  const getValue = () => {
    if (action.actionTemplates == undefined) {
      return []
    }
    return action.actionTemplates.map(actionTemplate => ({
      title: actionTemplate,
      value: actionTemplate
    }))
  }

  return (
    <>
      <Autocomplete
        id="action-tempaltes-auto"
        className={styles.textField}
        options={actionTemplates}
        getOptionLabel={option => option.title}
        renderInput={(params) => <TextField {...params} label="Action Templates"/> }
        disabled={creating || updating}
        value={getValue()}
        getOptionSelected={(option, value) => {
          return option.title === value.title
        }}
        onChange={onActionTemplateChange}
        multiple
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


export default CompoundAction