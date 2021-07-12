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
import AddIcon from '@material-ui/icons/Add';

import { useSelector, useDispatch } from 'react-redux';
import * as workflowSelectors from '../redux/workflow/workflow.selectors'
import * as workflowActions from '../redux/workflow/workflow.actions'

import { SnackbarContext } from '../components/notification/SnackbarProvider'

import WorkflowTemplateEditor from '../components/workflow.template.editor'

const DEFAULT_WORKFLOW_TEMPLATE = {
  "id": "",
  "name": "",
  "active": true,
  "rules": [
  ],
  "startState": {
    "name": "START",
    "terminal": false
  }
}

const WorkflowTemplates = () => {

  const match = useRouteMatch()
  const dispatch = useDispatch()
  const styles = useStyles()
  const [createTemplate, setCreateTemplate] = useState(false)
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const [updateModal, setUpdateModal] = useState(false)
  const [updatingTemplate, setUpdatingTemplate] = useState(false)
  const [updatedWorkflowTemplate, setUpdatedWorkflowTemplate] = useState(DEFAULT_WORKFLOW_TEMPLATE)
  const [workflowTemplate, setWorkflowTemplate] = useState(DEFAULT_WORKFLOW_TEMPLATE)
  const workflowTemplates = useSelector(state => workflowSelectors.getWorkflowTemplates(state))
  const workflowTemplateCreateProgress = useSelector(state => workflowSelectors.getWorkflowCreateProgress(state, workflowTemplate.name))
  const workflowTemplateUpdateProgress = useSelector(state => workflowSelectors.getWorkflowUpdateProgress(state, updatedWorkflowTemplate.id))
  const snackbarValue = React.useContext(SnackbarContext)
  const { showSuccess, showError } = snackbarValue

  // create template notification
  useEffect(() => {
    if (creatingTemplate) {
      if (workflowTemplateCreateProgress.completed) {
        setCreatingTemplate(false)
        setWorkflowTemplate(DEFAULT_WORKFLOW_TEMPLATE)
        showSuccess("Workflow template created")
      }
      if (workflowTemplateCreateProgress.failed) {
        setCreatingTemplate(false)
        showError("Workflow template creation failed")
      }
    }

  }, [creatingTemplate, workflowTemplateCreateProgress])

  // update template notification
  useEffect(() => {
    if (updatingTemplate) {
      if (workflowTemplateUpdateProgress.completed) {
        setUpdatingTemplate(false)
        setUpdatedWorkflowTemplate(DEFAULT_WORKFLOW_TEMPLATE)
        showSuccess("Workflow template updated")
      }
      if (workflowTemplateUpdateProgress.failed) {
        setUpdatingTemplate(false)
        showError("Workflow template update failed")
      }
    }

  }, [updatingTemplate, workflowTemplateUpdateProgress])

  const onCreateWorkflowTemplate = () => {
    setCreatingTemplate(true)
    dispatch(workflowActions.createWorkflowTemplate(workflowTemplate))
    setTimeout(() => {
      setCreatingTemplate(false)
    }, 2000)
  }

  const onUpdateWorkflowTemplate = () => {
    setUpdatingTemplate(true)
    dispatch(workflowActions.updateWorkflowTemplate(updatedWorkflowTemplate))
    setTimeout(() => {
      setUpdatingTemplate(false)
    }, 2000)
  }

  const onCancelEdit = () => {
    setWorkflowTemplate(DEFAULT_WORKFLOW_TEMPLATE)
    setCreateTemplate(false)
  }

  const onUpdateClick = (workflowTemplate) => {
    setUpdatedWorkflowTemplate(workflowTemplate)
    setUpdateModal(true)
  }

  const onCancelUpdate = () => {
    setUpdatedWorkflowTemplate(DEFAULT_WORKFLOW_TEMPLATE)
    setUpdateModal(false)
  }

  const CustomLink = props => <Link to={props.to} {...props} />

  return (
    <Container maxWidth="lg">
      <List>
      {
        workflowTemplates.map((workflowTemplate, i)=> {
          return (
              <ListItem key={"workflow-template-" + i} button component={ props => <CustomLink to={`${match.url}/${workflowTemplate.id}`} {...props} style={{ textAlign: 'center' }} /> }>
                <ListItemText primary={workflowTemplate.name}/>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="more" onClick={() => onUpdateClick(workflowTemplate)}>
                    <MoreVert />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
          )
        })
      }
      </List>
      <Modal
        open={createTemplate}
        onClose={() => {
          setCreateTemplate(false)
        }}
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
          <WorkflowTemplateEditor 
            workflowTemplate={workflowTemplate}
            setWorkflowTemplate={setWorkflowTemplate}
            creatingTemplate={creatingTemplate}
            updatingTemplate={updatingTemplate}
            update={false}
            create={true}
            workflowTemplates={workflowTemplates}
          />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            { 
              <Button disabled={creatingTemplate} variant="contained" color="secondary" className={styles.button} onClick={onCancelEdit}>
              { "CANCEL" }
              </Button>
            }
            <Button variant="contained" disabled={creatingTemplate} color="secondary" className={styles.button} onClick={onCreateWorkflowTemplate}>
              { "CREATE" }
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={updateModal}
        onClose={onCancelUpdate}
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
          <WorkflowTemplateEditor 
            workflowTemplate={updatedWorkflowTemplate}
            setWorkflowTemplate={setUpdatedWorkflowTemplate}
            creatingTemplate={creatingTemplate}
            updatingTemplate={updatingTemplate}
            update={true}
            create={false}
            workflowTemplates={workflowTemplates}
          />
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            { 
              <Button disabled={updatingTemplate} variant="contained" color="secondary" className={styles.button} onClick={onCancelUpdate}>
              { "CANCEL" }
              </Button>
            }
            <Button variant="contained" disabled={updatingTemplate} color="secondary" className={styles.button} onClick={onUpdateWorkflowTemplate}>
              { "UPDATE" }
            </Button>
          </div>
        </div>
      </Modal>
      <Fab color="secondary" aria-label="add" className={styles.fab} onClick={() => { setCreateTemplate(true) }}>
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
    "marginTop": theme.spacing(1),
    width: '100%'
  },
  button: {
    "marginTop": theme.spacing(1),
    width: 100
  }
}))

export default WorkflowTemplates