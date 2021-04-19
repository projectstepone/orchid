import { produce } from 'immer'
import * as workflowTypes from './workflow.types'

const DEFAULT_ACTION_PROGRESS = {
  processing: false,
  completed: false,
  failed: false,
  message: ""
}

const initialState = {
  workflowTemplatesById: {},
  workflowTransitionsById: {},
  transitionsByWorkflowTemplateId: {},
  workflowActionsById: {},
  transitionUpdateProgress: {},
  transitionCreateProgress: {}
}

const workflowTemplateFetchInProgress = (state, action) => {
  return state
}

const workflowTemplateFetchCompleted = (state, { payload: { workflowTemplates }}) => {
  return produce(state, draftState => {
    workflowTemplates.forEach( workflowTemplate => {
      draftState['workflowTemplatesById'][workflowTemplate.id] = workflowTemplate
    })
  })
}

const workflowTemplateFetchFailed = (state, action) => {
  return state
}

const workflowTransitionsFetchInProgress = (state, action) => {
  return state
}

const workflowTransitionsFetchCompleted = (state, { payload: { workflowTemplateId, transitions }}) => {
  return produce(state, draftState => {
    transitions.forEach(transition => {
      draftState['workflowTransitionsById'][transition.id] = transition
      if (!draftState['transitionsByWorkflowTemplateId'][workflowTemplateId]) {
        draftState['transitionsByWorkflowTemplateId'][workflowTemplateId] = {}
        draftState['transitionsByWorkflowTemplateId'][workflowTemplateId][transition.id] = true
      } else {
        draftState['transitionsByWorkflowTemplateId'][workflowTemplateId][transition.id] = true
      }
    })
  })
}

const workflowTransitionsFetchFailed = (state, action) => {
  return state
}

const workflowActionsFetchInProgress = (state, action) => {
  return state
}

const workflowActionsFetchCompleted = (state, { payload: { actions }}) => {
  return produce(state, draftState => {
    actions.forEach(action => {
      draftState['workflowActionsById'][action.templateId] = action
    })
  })
}

const workflowActionsFetchFailed = (state, action) => {
  return state
}

const updateTransitionInProgress = (state, { payload: { workflowTemplateId, transitionId }}) => {
  return produce(state, draftState => {
    if (!draftState['transitionUpdateProgress'][workflowTemplateId]) {
      draftState['transitionUpdateProgress'][workflowTemplateId] = {}
    }
    draftState['transitionUpdateProgress'][workflowTemplateId][transitionId] = {
      ...DEFAULT_ACTION_PROGRESS,
      processing: true
    }
  })
}

const updateTransitionCompleted = (state, { payload: { workflowTemplateId, transitionId }}) => {
  return produce(state, draftState => {
    if (!draftState['transitionUpdateProgress'][workflowTemplateId]) {
      draftState['transitionUpdateProgress'][workflowTemplateId] = {}
    }
    draftState['transitionUpdateProgress'][workflowTemplateId][transitionId] = {
      ...DEFAULT_ACTION_PROGRESS,
      completed: true
    }
  })
}

const updateTransitionFailed = (state, { payload: { workflowTemplateId, transitionId }}) => {
  return produce(state, draftState => {
    if (!draftState['transitionUpdateProgress'][workflowTemplateId]) {
      draftState['transitionUpdateProgress'][workflowTemplateId] = {}
    }
    draftState['transitionUpdateProgress'][workflowTemplateId][transitionId] = {
      ...DEFAULT_ACTION_PROGRESS,
      failed: true
    }
  })
}

const createTransitionsInProgress = (state, { payload: { workflowTemplateId, transitionId }}) => {
  return produce(state, draftState => {
    if (!draftState['transitionCreateProgress'][workflowTemplateId]) {
      draftState['transitionCreateProgress'][workflowTemplateId] = {}
    }
    draftState['transitionCreateProgress'][workflowTemplateId][transitionId] = {
      ...DEFAULT_ACTION_PROGRESS,
      processing: true
    }
  })
}

const createTransitionsCompleted = (state, { payload: { workflowTemplateId, transitionId }}) => {
  return produce(state, draftState => {
    if (!draftState['transitionCreateProgress'][workflowTemplateId]) {
      draftState['transitionCreateProgress'][workflowTemplateId] = {}
    }
    draftState['transitionCreateProgress'][workflowTemplateId][transitionId] = {
      ...DEFAULT_ACTION_PROGRESS,
      completed: true
    }
  })
}

const createTransitionsFailed = (state, { payload: { workflowTemplateId, transitionId }}) => {
  return produce(state, draftState => {
    if (!draftState['transitionCreateProgress'][workflowTemplateId]) {
      draftState['transitionCreateProgress'][workflowTemplateId] = {}
    }
    draftState['transitionCreateProgress'][workflowTemplateId][transitionId] = {
      ...DEFAULT_ACTION_PROGRESS,
      failed: true
    }
  })
}

const handlers = {
  [workflowTypes.FETCH_WORKFLOW_TEMPLATES_IN_PROGRESS]: workflowTemplateFetchInProgress,
  [workflowTypes.FETCH_WORKFLOW_TEMPLATES_FAILED]: workflowTemplateFetchFailed,
  [workflowTypes.FETCH_WORKFLOW_TEMPLATES_COMPLETED]: workflowTemplateFetchCompleted,

  [workflowTypes.FETCH_WORKFLOW_TRANSITIONS_IN_PROGRESS]: workflowTransitionsFetchInProgress,
  [workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED]: workflowTransitionsFetchCompleted,
  [workflowTypes.FETCH_WORKFLOW_TRANSITIONS_FAILED]: workflowTransitionsFetchFailed,

  [workflowTypes.FETCH_WORKFLOW_ACTIONS_IN_PROGRESS]: workflowActionsFetchInProgress,
  [workflowTypes.FETCH_WORKFLOW_ACTIONS_COMPLETED]: workflowActionsFetchCompleted,
  [workflowTypes.FETCH_WORKFLOW_ACTIONS_FAILED]: workflowActionsFetchFailed,

  [workflowTypes.UPDATE_TRANSITION_IN_PROGRESS]: updateTransitionInProgress,
  [workflowTypes.UPDATE_TRANSITION_COMPLETED]: updateTransitionCompleted,
  [workflowTypes.UPDATE_TRANSITION_FAILED]: updateTransitionFailed,

  [workflowTypes.CREATE_TRANSITIONS_IN_PROGRESS]: createTransitionsInProgress,
  [workflowTypes.CREATE_TRANSITIONS_COMPLETED]: createTransitionsCompleted,
  [workflowTypes.CREATE_TRANSITIONS_FAILED]: createTransitionsFailed
}

export default (state = initialState, action) => {
  console.log("[workflow][actions]", action)
  if(handlers[action.type]) {
    const nextState = handlers[action.type](state, action)
    console.log("workflowNextState", nextState)
    return nextState
  }
  return state
}