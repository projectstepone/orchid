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
  transitionCreateProgress: {},
  workflowTemplateCreateProgress: {},
  workflowTemplateUpdateProgress: {},
  actionCreateProgress: {},
  actionUpdateProgress: {}
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

// workflowTemplateCreateProgress
export const createWorkflowTemplateInProgress = (state, { payload: { workflowTemplateName }}) => {
  return produce(state, draftState => {
    draftState['workflowTemplateCreateProgress'][workflowTemplateName] = {
      ...DEFAULT_ACTION_PROGRESS,
      processing: true
    }
  })
}

export const createWorkflowTemplateCompleted = (state, { payload: { workflowTemplateName }}) => {
  return produce(state, draftState => {
    draftState['workflowTemplateCreateProgress'][workflowTemplateName] = {
      ...DEFAULT_ACTION_PROGRESS,
      completed: true
    }
  })
}

export const createWorkflowTemplateFailed = (state, { payload: { workflowTemplateName }}) => {
  return produce(state, draftState => {
    draftState['workflowTemplateCreateProgress'][workflowTemplateName] = {
      ...DEFAULT_ACTION_PROGRESS,
      failed: true
    }
  })
}

// workflowTemplateUpdateProgress
export const updateWorkflowTemplateInProgress = (state, { payload: { templateId }}) => {
  return produce(state, draftState => {
    draftState['workflowTemplateUpdateProgress'][templateId] = {
      ...DEFAULT_ACTION_PROGRESS,
      processing: true
    }
  })
}

export const updateWorkflowTemplateCompleted = (state, { payload: { templateId }}) => {
  return produce(state, draftState => {
    draftState['workflowTemplateUpdateProgress'][templateId] = {
      ...DEFAULT_ACTION_PROGRESS,
      completed: true
    }
  })
}

export const updateWorkflowTemplateFailed = (state, { payload: { templateId }}) => {
  return produce(state, draftState => {
    draftState['workflowTemplateUpdateProgress'][templateId] = {
      ...DEFAULT_ACTION_PROGRESS,
      failed: true
    }
  })
}

// create workflowAction
const createWorkflowActionInProgress = (state, { payload: { action }}) => {
  return produce(state, draftState => {
    draftState['actionCreateProgress'][action.templateId] = {
      ...DEFAULT_ACTION_PROGRESS,
      processing: true
    }
  })
}

const createWorkflowActionCompleted = (state, { payload: { action }}) => {
  return produce(state, draftState => {
    draftState['actionCreateProgress'][action.templateId] = {
      ...DEFAULT_ACTION_PROGRESS,
      completed: true
    }
  })
}

const createWorkflowActionFailed = (state, { payload: { action }}) => {
  return produce(state, draftState => {
    draftState['actionCreateProgress'][action.templateId] = {
      ...DEFAULT_ACTION_PROGRESS,
      failed: true
    }
  })
}

// update workflowAction
const updateWorkflowActionInProgress = (state, { payload: { action }}) => {
  return produce(state, draftState => {
    draftState['actionUpdateProgress'][action.templateId] = {
      ...DEFAULT_ACTION_PROGRESS,
      processing: true
    }
  })
}

const updateWorkflowActionCompleted = (state, { payload: { action }}) => {
  return produce(state, draftState => {
    draftState['actionUpdateProgress'][action.templateId] = {
      ...DEFAULT_ACTION_PROGRESS,
      completed: true
    }
  })
}

const updateWorkflowActionFailed = (state, { payload: { action }}) => {
  return produce(state, draftState => {
    draftState['actionUpdateProgress'][action.templateId] = {
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
  [workflowTypes.CREATE_TRANSITIONS_FAILED]: createTransitionsFailed,

  [workflowTypes.CREATE_WORKFLOW_TEMPLATE_IN_PROGRESS]: createWorkflowTemplateInProgress,
  [workflowTypes.CREATE_WORKFLOW_TEMPLATE_COMPLETED]: createWorkflowTemplateCompleted,
  [workflowTypes.CREATE_WORKFLOW_TEMPLATE_FAILED]: createWorkflowTemplateFailed,

  [workflowTypes.UPDATE_WORKFLOW_TEMPLATE_IN_PROGRESS]: updateWorkflowTemplateInProgress,
  [workflowTypes.UPDATE_WORKFLOW_TEMPLATE_COMPLETED]: updateWorkflowTemplateCompleted,
  [workflowTypes.UPDATE_WORKFLOW_TEMPLATE_FAILED]: updateWorkflowTemplateFailed,

  [workflowTypes.CREATE_WORKFLOW_ACTION_IN_PROGRESS]: createWorkflowActionInProgress,
  [workflowTypes.CREATE_WORKFLOW_ACTION_COMPLETED]: createWorkflowActionCompleted,
  [workflowTypes.CREATE_WORKFLOW_ACTION_FAILED]: createWorkflowActionFailed,

  [workflowTypes.UPDATE_WORKFLOW_ACTION_IN_PROGRESS]: updateWorkflowActionInProgress,
  [workflowTypes.UPDATE_WORKFLOW_ACTION_COMPLETED]: updateWorkflowActionCompleted,
  [workflowTypes.UPDATE_WORKFLOW_ACTION_FAILED]: updateWorkflowActionFailed,
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