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

import { SnackbarContext } from '../components/notification/SnackbarProvider'

import {
  HttpAction,
  CompoundAction,
  EvaluatedAction,
  RoutedAction,
  TranslatorAction
} from '../components/actions'

import ActionEditor from '../components/action.editor'
import * as workflowSelectors from '../redux/workflow/workflow.selectors'
import {
  createWorkflowAction,
  updateWorkflowAction
} from '../redux/workflow/workflow.actions'
import { useDispatch } from 'react-redux'

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

const WorkflowActions = () => {

  const styles = useStyles()
  const dispatch = useDispatch()
  const [actionCreating, setActionCreating] = useState(false)
  const [action, setAction] = useState(DEFAULT_WORKFLOW_ACTION)
  const [editedAction, setEditedAction] = useState(DEFAULT_WORKFLOW_ACTION)
  const [editModal, setEditModal] = useState(false)
  const [createModal, setCreateModal] = useState(false)
  const [actionUpdating, setActionUpdating] = useState(false)
  const [term, setTerm] = useState("")
  const workflowActionsById = useSelector(state => state.workflow.workflowActionsById)
  const actionCreateProgress = useSelector(state => workflowSelectors.getActionCreateProgress(state, action.templateId))
  const actionUpdateProgress = useSelector(state => workflowSelectors.getActionUpdateProgress(state, editedAction.templateId))
  const actionTemplates = Object.keys(workflowActionsById).map((id, i) => ({
    title: workflowActionsById[id].templateId,
  }))
  const snackbarValue = React.useContext(SnackbarContext)
  const { showSuccess, showError } = snackbarValue

  const workflowActions = Object.keys(workflowActionsById)
    .map(actionId=> workflowActionsById[actionId])
    .filter(action => {
      const parts = term.split(" ")
      if (parts.length === 0) {
        return true
      }
      for (let i in parts) {
        if (action.name.toLowerCase().includes(parts[i])) {
          return true
        }
      }
      return false
    })

  // create template notification
  useEffect(() => {
    if (actionCreating) {
      if (actionCreateProgress.completed) {
        setActionCreating(false)
        setAction(DEFAULT_WORKFLOW_ACTION)
        showSuccess("Action created")
      }
      if (actionCreateProgress.failed) {
        setActionCreating(false)
        showError("Action creation failed")
      }
    }

  }, [actionCreating, actionCreateProgress])

  // create template notification
  useEffect(() => {
    if (actionUpdating) {
      if (actionUpdateProgress.completed) {
        setActionUpdating(false)
        showSuccess("Action updated")
      }
      if (actionUpdateProgress.failed) {
        setActionUpdating(false)
        showError("Action update failed")
      }
    }

  }, [actionUpdating, actionUpdateProgress])

  const onActionCreate = () => {
    setActionCreating(true)
    dispatch(createWorkflowAction(action))
    setTimeout(() => {
      setActionCreating(false)
    }, 2000)
  }

  const onActionUpdate = () => {
    setActionUpdating(true)
    dispatch(updateWorkflowAction(editedAction))
    setTimeout(() => {
      setActionUpdating(false)
    }, 2000)
  }

  const onCloseModal = () => {
    setAction(produce(DEFAULT_WORKFLOW_ACTION, draftAction => {}))
    setCreateModal(false)
  }

  const onEditAction = (actionId) => {
    setEditModal(true)
    setEditedAction(workflowActionsById[actionId])
  }

  const onEditClose = () => {
    setEditModal(false)
    setEditedAction(DEFAULT_WORKFLOW_ACTION)
  }

  const onTermChange = (event, value) => {
    setTerm(event.target.value)
  }

  return (
    <Container maxWidth="lg">
      <TextField
        className={styles.textField}
        label={"Search"}
        value={term}
        disabled={false}
        onChange={onTermChange}
      />
      <List>
        {
          workflowActions.map((action, i)=> {
            return (
              <ListItem key={"workflow-action-" + i} className={styles.link} button onClick={() => onEditAction(action.templateId) }>
                <ListItemText primary={action.name}/>
              </ListItem>
            )
          })
        }
      </List>
      <Modal
        open={createModal}
        onClose={onCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div 
          className={styles.paper}
          style={{
            top: `${50}%`,
            left: `${50}%`,
            transform: `translate(-${50}%, -${50}%)`,
            maxHeight: 500,
            overflow: 'scroll'
          }}
        >
          <ActionEditor 
            action={action}
            setAction={setAction}
            actionTemplates={actionTemplates}
            updating={actionUpdating}
            creating={actionCreating}
          />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            { 
              <Button disabled={actionCreating} variant="contained" color="secondary" className={styles.button} onClick={onCloseModal}>
              { "CANCEL" }
              </Button>
            }
            <Button variant="contained" disabled={actionCreating} color="secondary" className={styles.button} onClick={onActionCreate}>
              { "CREATE" }
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={editModal}
        onClose={onEditClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div 
          className={styles.paper}
          style={{
            top: `${50}%`,
            left: `${50}%`,
            transform: `translate(-${50}%, -${50}%)`,
            maxHeight: 500,
            overflow: 'scroll'
          }}
        >
          <ActionEditor 
            action={editedAction}
            setAction={setEditedAction}
            actionTemplates={actionTemplates}
            updating={actionUpdating}
            creating={actionCreating}
          />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            { 
              <Button disabled={actionUpdating} variant="contained" color="secondary" className={styles.button} onClick={onEditClose}>
              { "CANCEL" }
              </Button>
            }
            <Button variant="contained" disabled={actionUpdating} color="secondary" className={styles.button} onClick={onActionUpdate}>
              { "UPDATE" }
            </Button>
          </div>
        </div>
      </Modal>
      <Fab color="secondary" aria-label="add" className={styles.fab} onClick={() => { setCreateModal(true) }}>
        <AddIcon />
      </Fab>
    </Container>
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
    marginTop: theme.spacing(1),
    width: '100%'
  },
  button: {
    "marginTop": theme.spacing(1),
    width: 100
  }
}))

export default WorkflowActions