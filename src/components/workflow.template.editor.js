import React, { useState, useEffect } from 'react'
import { produce } from 'immer'
import {
  Link,
  useRouteMatch
} from 'react-router-dom'

import { 
  Container, List, ListItem, Divider, Fab, Modal,
  TextField, Button, FormControlLabel, Checkbox, ListItemText,
  ListItemSecondaryAction, IconButton
} from '@material-ui/core'

import MoreVert from '@material-ui/icons/MoreVert'

import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'

import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

const WorkflowTemplateEditor = (props) => {
  
  const styles = useStyles()
  const [copy, setCopy] = useState(false)
  const { workflowTemplate, setWorkflowTemplate, creatingTemplate, updatingTemplate, create, update, workflowTemplates } = props

  const onTemplateNameChange = (event) => {
    setWorkflowTemplate(produce(workflowTemplate, draft => {
      draft.name = event.target.value
    }))
  }

  const onTemplateActiveChange = () => {
    setWorkflowTemplate(produce(workflowTemplate, draft => {
      draft.active = !draft.active
    }))
  }

  const onStartStateChange = (event) => {
    setWorkflowTemplate(produce(workflowTemplate, draft => {
      draft.startState.name = event.target.value
    }))
  }

  const onRuleChange = (event) => {
    setWorkflowTemplate(produce(workflowTemplate, draft => {
      draft.rules[0] = event.target.value
    }))
  }

  const onTemplateChange = (event, value) => {
    if (value == null) {
      return
    }
    setWorkflowTemplate(produce(workflowTemplate, draft => {
      draft.templateName = value.title
    }))
  }

  return (
    <>
      <h3>Workflow Template</h3>
      { update && <TextField
        className={styles.textField}
        label={"Id"}
        value={workflowTemplate.id}
        disabled={true}
      />}
      <TextField
        className={styles.textField}
        label={"Name"}
        value={workflowTemplate.name}
        disabled={creatingTemplate || updatingTemplate}
        onChange={onTemplateNameChange}
      />
      <FormControlLabel
        className={styles.textField}
        control={
          <Checkbox
            checked={workflowTemplate.active}
            name="active_checkbox"
            color="secondary"
            disabled={creatingTemplate || updatingTemplate}
            onChange={onTemplateActiveChange}
          />
        }
        label="Active"
      />
      <TextField
        className={styles.textField}
        label={"Start state"}
        value={workflowTemplate.startState.name}
        disabled={creatingTemplate || updatingTemplate}
        onChange={onStartStateChange}
      />
      <FormControlLabel
        className={styles.textField}
        control={
          <Checkbox
            checked={false}
            name="active_checkbox"
            color="secondary"
            disabled={creatingTemplate || updatingTemplate}
          />
        }
        label="Is Terminal ?"
      />
      <TextField
        className={styles.textField}
        label={"Rule"}
        multiline={true}
        disabled={creatingTemplate || updatingTemplate}
        value={workflowTemplate.rules.length !== 0 ? workflowTemplate.rules[0] : ""}
        onChange={onRuleChange}
      />
      { create && <FormControlLabel
        className={styles.textField}
        control={
          <Checkbox
            checked={copy}
            name="active_checkbox"
            color="secondary"
            disabled={creatingTemplate || updatingTemplate}
            onChange={() => {
              if (copy) {
                setWorkflowTemplate(produce(workflowTemplate, draft => {
                  delete draft['templateName']
                }))
              }
              setCopy(!copy)
            }}
          />
        }
        label="Copy from other Template ?"
      />}
      {
        copy && <Autocomplete
          id="copy-template-auto"
          className={styles.textField}
          options={workflowTemplates.map(template => ({ title: template.name }))}
          getOptionLabel={option => option.title}
          renderInput={(params) => <TextField {...params} label="Template"/> }
          disabled={false}
          value={workflowTemplate.templateName ? { title: workflowTemplate.templateName, value: workflowTemplate.templateName} : null}
          getOptionSelected={(option, value) => {
            return option.title === value.title
          }}
          onChange={onTemplateChange}
          disabled={creatingTemplate || updatingTemplate}
        />
      }
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
    position: 'fixed',
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
  },
  button: {
    "marginTop": theme.spacing(1),
    width: 100
  }
}))

export default WorkflowTemplateEditor