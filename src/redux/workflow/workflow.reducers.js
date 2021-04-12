import { produce } from 'immer'
import * as workflowTypes from './workflow.types'

const initialState = {
  workflowTemplatesById: {},
  workflowTransitionsById: {},
  transitionsByWorkflowTemplateId: {},
  workflowActionsById: {}
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

const handlers = {
  [workflowTypes.FETCH_WORKFLOW_TEMPLATES_IN_PROGRESS]: workflowTemplateFetchInProgress,
  [workflowTypes.FETCH_WORKFLOW_TEMPLATES_FAILED]: workflowTemplateFetchFailed,
  [workflowTypes.FETCH_WORKFLOW_TEMPLATES_COMPLETED]: workflowTemplateFetchCompleted,

  [workflowTypes.FETCH_WORKFLOW_TRANSITIONS_IN_PROGRESS]: workflowTransitionsFetchInProgress,
  [workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED]: workflowTransitionsFetchCompleted,
  [workflowTypes.FETCH_WORKFLOW_TRANSITIONS_FAILED]: workflowTransitionsFetchFailed,

  [workflowTypes.FETCH_WORKFLOW_ACTIONS_IN_PROGRESS]: workflowActionsFetchInProgress,
  [workflowTypes.FETCH_WORKFLOW_ACTIONS_COMPLETED]: workflowActionsFetchCompleted,
  [workflowTypes.FETCH_WORKFLOW_ACTIONS_FAILED]: workflowActionsFetchFailed
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