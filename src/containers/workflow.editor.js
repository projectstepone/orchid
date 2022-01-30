import React, { useState, useCallback, useEffect, useContext } from 'react'
import { produce } from 'immer'
import ReactFlow, { removeElements, addEdge, Background, MiniMap, Controls } from 'react-flow-renderer'
import { useSelector, useDispatch } from 'react-redux';
import Popover from '@material-ui/core/Popover'
import { MenuItem, TextField, Button, Paper } from '@material-ui/core'

import {
  useParams,
  useRouteMatch
} from 'react-router-dom'

import * as workflowSelectors from '../redux/workflow/workflow.selectors'
import * as workflowActions from '../redux/workflow/workflow.actions'
import * as breadcrumbActions from '../redux/breadcrumb/breadcrumb.actions'

import CustomEdge from '../components/reactflow/custom.edge'
import TransitionEditor from '../components/transition.editor'

import { SnackbarContext } from '../components/notification/SnackbarProvider'

const edgeTypes = {
  custom: CustomEdge,
}

const escapeDoubleQuotes = (str) => {
	return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
}

const WorkflowEditor = () => {

  const { workflowTemplateId } = useParams()
  const dispatch = useDispatch()
  const match = useRouteMatch()
  const [addTransition, setAddTransition] = useState(false)
  const [addingTransition, setAddingTransition] = useState(false)
  const [popOverLocation, setPopOverLocation] = useState({ top: 600, left: 600 })
  const [selectedState, setSelectedState] = useState({})
  const [updatingTransition, setUpdatingTransition] = useState(false)
  const [updatingTransitionId, setUpdatingTransitionId] = useState('')
  const [creatingTransition, setCreatingTransition] = useState(false)
  const [creatingTransitionId, setCreatingTransitionId] = useState('')
  const updateTransitionProgress = useSelector(state => workflowSelectors.selectTransitionUpdateProgressByTransitionId(state, workflowTemplateId, updatingTransitionId))
  const createTransitionProgress = useSelector(state => workflowSelectors.selectTransitionCreateProgressByTransitionId(state, workflowTemplateId, creatingTransitionId))
  const workflowStates = useSelector(state => workflowSelectors.selectStatesByWorkflowTemplateId(state, workflowTemplateId))
  const workflowAllActions = useSelector(state => workflowSelectors.selectAllActions(state))
  const elements = useSelector(state => workflowSelectors.selectReactFlowElements(state, workflowTemplateId, updatingTransitionId))

  const snackbarValue = useContext(SnackbarContext)
  const { showSuccess, showError } = snackbarValue

  const onTransitionUpdate = useCallback((transition) => {
    const updatedTransition = produce(transition, draftTransition => {
      // if (draftTransition.rule) {
      //   draftTransition.rule = escapeDoubleQuotes(draftTransition.rule)
      // }
    })
    dispatch(workflowActions.updateTransition(workflowTemplateId, updatedTransition))
    setUpdatingTransition(true)
    setUpdatingTransitionId(transition.id)
    setTimeout(() => {
      setUpdatingTransition(false)
      setUpdatingTransitionId('')
    }, 2000)
  }, [dispatch])

  const onTransitionCreate = useCallback((transition) => {
    const updatedTransition = produce(transition, draftTransition => {
      // if (draftTransition.rule) {
      //   draftTransition.rule = escapeDoubleQuotes(draftTransition.rule)
      // }
    })
    dispatch(workflowActions.createTransition(workflowTemplateId, updatedTransition))
    setCreatingTransition(true)
    setCreatingTransitionId(transition.id)
    setTimeout(() => {
      setCreatingTransition(false)
      setCreatingTransitionId('')
    }, 2000)
  }, [dispatch])

  useEffect(() => {
    if (updatingTransition) {
      if (updateTransitionProgress.failed) {
        showError("Transition update failed")
        setUpdatingTransition(false)
      }
      if (updateTransitionProgress.completed) {
        showSuccess("Transition updated")
        setUpdatingTransitionId('')
        setUpdatingTransition(false)
      }
    }
  }, [updatingTransition, updateTransitionProgress])

  useEffect(() => {
    if (creatingTransition) {
      if (createTransitionProgress.failed) {
        showError("Transition creation failed")
        setCreatingTransition(false)
      }
      if (createTransitionProgress.completed) {
        showSuccess("Transition created")
        setCreatingTransitionId('')
        setCreatingTransition(false)
      }
    }
  }, [creatingTransition, createTransitionProgress])

  const onPaneClick = (event) => {
    console.log('event', event)
    setAddTransition(false)
  }

  const onConnect = (params) => {
    console.log('params', params)
  }

  const onElementClick = (event, element) => {
    console.log('element', element)
    if (element.type !== 'default') {
      return
    }
    const { pageX, pageY } = event
    setPopOverLocation({
      ...popOverLocation,
      top: pageY,
      left: pageX
    })
    setAddTransition(true)
    setSelectedState(element)
  }

  const handleAddTransition = () => {
    console.log('handleAddTransition')
    setAddingTransition(true)
    setAddTransition(false)
  }

  console.log('selectedState', selectedState)

  return (
    <Paper id="editor" elevation={3} style={{ width: '100%', height: '80vh', maringBottom: '2%', marginTop: 10 }}>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{
          top: popOverLocation.top,
          left: popOverLocation.left
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={addTransition}
        onClose={() => {
          setAddTransition(false)
        }}
      >
        <MenuItem style={{ padding: 20 }} onClick={handleAddTransition}>Add Transition</MenuItem>
      </Popover>
      <ReactFlow
        style={{
          flex: 1
        }}
        snapToGrid
        elements={elements.map(element => {
          if (element.data.onTransitionUpdate) {
            element.data.onTransitionUpdate = onTransitionUpdate
          }
          return element
        })}
        onPaneClick={onPaneClick}
        onConnect={onConnect}
        onElementClick={onElementClick}
        edgeTypes={edgeTypes}
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={10} />
     </ReactFlow>
     <TransitionEditor 
        location={popOverLocation}
        open={addingTransition}
        onTransitionEditorClosed={() => {
          setAddingTransition(false)
        }}
        transition={{
          "id": "",
          "type": "EVALUATED",
          "fromState": selectedState.id,
          "active": true,
          "toState": {
            "name": "",
            "terminal": false
          },
          "action": "",
          "rule": ""
        }}
        createProgress={createTransitionProgress}
        states={workflowStates}
        actions={workflowAllActions}
        create={true}
        onTransitionCreate={onTransitionCreate}
      />
    </Paper>
  )
}

export default WorkflowEditor