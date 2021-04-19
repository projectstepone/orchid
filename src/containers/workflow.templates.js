import React, { useState, useEffect } from 'react'
import { produce } from 'immer'
import {
  Link,
  useRouteMatch
} from 'react-router-dom'

import { 
  Container, List, ListItem, Divider, Fab, Modal,
  TextField, Button, FormControlLabel, Checkbox
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add';

import { useSelector, useDispatch } from 'react-redux';
import * as workflowSelectors from '../redux/workflow/workflow.selectors'
import * as workflowActions from '../redux/workflow/workflow.actions'
import * as breadcrumbActions from '../redux/breadcrumb/breadcrumb.actions'

import { SnackbarContext } from '../components/notification/SnackbarProvider'

const DEFAULT_WORKFLOW_TEMPLATE = {
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
  const [workflowTemplate, setWorkflowTemplate] = useState(JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_TEMPLATE)))
  const workflowTemplates = useSelector(state => workflowSelectors.getWorkflowTemplates(state))
  const workflowTemplateCreateProgress = useSelector(state => workflowSelectors.getWorkflowCreateProgress(state, workflowTemplate.name))
  const snackbarValue = React.useContext(SnackbarContext)
  const { showSuccess, showError } = snackbarValue

  useEffect(() => {
    dispatch(breadcrumbActions.pushBreadcrumb({
      title: "Workflow Templates",
      link: match.url
    }))
  }, [dispatch, match.url])

  useEffect(() => {

    if (creatingTemplate) {
      if (workflowTemplateCreateProgress.completed) {
        setCreatingTemplate(false)
        setWorkflowTemplate(JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_TEMPLATE)))
        showSuccess("Workflow template created")
      }
      if (workflowTemplateCreateProgress.failed) {
        setCreatingTemplate(false)
        showError("Workflow template creation failed")
      }
    }

  }, [creatingTemplate, workflowTemplateCreateProgress])

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

  const onCreateWorkflowTemplate = () => {
    setCreatingTemplate(true)
    dispatch(workflowActions.createWorkflowTemplate(workflowTemplate))
    setTimeout(() => {
      setCreatingTemplate(false)
    }, 2000)
  }

  const onCancelEdit = () => {
    setWorkflowTemplate(JSON.parse(JSON.stringify(DEFAULT_WORKFLOW_TEMPLATE)))
    setCreateTemplate(false)
  }

  return (
    <Container maxWidth="sm">
      <List>
      {
        workflowTemplates.map(workflowTemplate => {
          return (
            <>
              <ListItem>
                <Link to={`${match.url}/${workflowTemplate.id}`} className={styles.link}>{ workflowTemplate.name }</Link>
              </ListItem>
              <Divider />
            </>
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
            transform: `translate(-${50}%, -${50}%)`
          }}
        >
          <h3>Workflow Template</h3>
          <TextField
            className={styles.textField}
            label={"Name"}
            value={workflowTemplate.name}
            disabled={creatingTemplate}
            onChange={onTemplateNameChange}
          />
          <FormControlLabel
            className={styles.textField}
            control={
              <Checkbox
                checked={workflowTemplate.active}
                name="active_checkbox"
                color="primary"
                disabled={creatingTemplate}
                onChange={onTemplateActiveChange}
              />
            }
            label="is template active ?"
          />
          <TextField
            className={styles.textField}
            label={"startState"}
            value={workflowTemplate.startState.name}
            disabled={creatingTemplate}
            onChange={onStartStateChange}
          />
          <FormControlLabel
            className={styles.textField}
            control={
              <Checkbox
                checked={false}
                name="active_checkbox"
                color="primary"
                disabled={creatingTemplate}
              />
            }
            label="is terminal ?"
          />
          <TextField
            className={styles.textField}
            label={"Rule"}
            multiline={true}
            disabled={creatingTemplate}
            value={workflowTemplate.rules[0]}
            onChange={onRuleChange}
          />
          <Button variant="contained" disabled={creatingTemplate} color="primary" className={styles.textField} onClick={onCreateWorkflowTemplate}>
            { "CREATE" }
          </Button>
          { 
            <Button disabled={creatingTemplate} variant="contained" color="primary" className={styles.textField} onClick={onCancelEdit}>
             { "CANCEL" }
            </Button>
          }
        </div>
      </Modal>
      <Fab color="primary" aria-label="add" className={styles.fab} onClick={() => { setCreateTemplate(true) }}>
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

export default WorkflowTemplates