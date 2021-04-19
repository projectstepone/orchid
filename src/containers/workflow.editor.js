import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { produce } from 'immer'
import ReactFlow, { removeElements, addEdge, Background, MiniMap, Controls } from 'react-flow-renderer'
import { useSelector, useDispatch } from 'react-redux';
import Popover from '@material-ui/core/Popover'
import { MenuItem, TextField, Button } from '@material-ui/core'

import * as workflowSelectors from '../redux/workflow/workflow.selectors'
import * as workflowActions from '../redux/workflow/workflow.actions'

import CustomEdge from '../components/reactflow/custom.edge'
import TransitionEditor from '../components/transition.editor'

import { SnackbarContext } from '../components/notification/SnackbarProvider'

const WORKFLOW_TEMPLATE_ID = 'f3fea53e-b497-4b5c-b146-894c8eae51b1'

const edgeTypes = {
  custom: CustomEdge,
}

const escapeDoubleQuotes = (str) => {
	return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
}

const WorkflowEditor = () => {

  const dispatch = useDispatch()
  const [addTransition, setAddTransition] = useState(false)
  const [addingTransition, setAddingTransition] = useState(false)
  const [popOverLocation, setPopOverLocation] = useState({ top: 600, left: 600 })
  const [selectedState, setSelectedState] = useState({})
  const [updatingTransition, setUpdatingTransition] = useState(false)
  const [updatingTransitionId, setUpdatingTransitionId] = useState('')
  const [creatingTransition, setCreatingTransition] = useState(false)
  const [creatingTransitionId, setCreatingTransitionId] = useState('')
  const updateTransitionProgress = useSelector(state => workflowSelectors.getTransitionUpdateProgress(state, WORKFLOW_TEMPLATE_ID, updatingTransitionId))
  const createTransitionProgress = useSelector(state => workflowSelectors.getTransitionCreateProgress(state, WORKFLOW_TEMPLATE_ID, creatingTransitionId))
  const workflowStates = useSelector(state => workflowSelectors.getAllStates(state, WORKFLOW_TEMPLATE_ID))
  const workflowAllActions = useSelector(state => workflowSelectors.getAllActions(state))

  const snackbarValue = React.useContext(SnackbarContext)
  const { showSuccess, showError } = snackbarValue

  const memoizedStates = useMemo(() => {
    return workflowStates
  }, [workflowStates.length])

  const memoizedActions = useMemo(() => {
    return workflowAllActions
  }, [workflowAllActions.length])

  const memoizedUpdateTransitionProgress = useMemo(() => {
    return updateTransitionProgress
  }, [updateTransitionProgress])

  const onTransitionUpdate = useCallback((transition) => {
    const updatedTransition = produce(transition, draftTransition => {
      // if (draftTransition.rule) {
      //   draftTransition.rule = escapeDoubleQuotes(draftTransition.rule)
      // }
    })
    dispatch(workflowActions.updateTransition(WORKFLOW_TEMPLATE_ID, updatedTransition))
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
    dispatch(workflowActions.createTransition(WORKFLOW_TEMPLATE_ID, updatedTransition))
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

  const elements = useSelector(
    state => workflowSelectors.getReactFlowElements(
      state,
      WORKFLOW_TEMPLATE_ID,
      updatingTransitionId,
      onTransitionUpdate,
      memoizedStates,
      memoizedUpdateTransitionProgress,
      memoizedActions
    )
  )

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
    <div id="editor" style={{ width: '100%', height: '90vh' }}>
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
        <MenuItem onClick={handleAddTransition}>Add Transition</MenuItem>
      </Popover>
      <ReactFlow
        style={{
          flex: 1
        }}
        snapToGrid
        elements={elements}
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
        states={memoizedStates}
        actions={memoizedActions}
        create={true}
        onTransitionCreate={onTransitionCreate}
      />
    </div>
  )
}

export default WorkflowEditor