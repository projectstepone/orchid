import axios from 'axios'

import * as workflowTypes from './workflow.types'

const BASE_URL = 'http://localhost:9090'

export const fetchWorkflowTemplates = () => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_IN_PROGRESS
    })
    axios.get(`${BASE_URL}/v1/templates/workflow`)
    .then(response => {
      const workflowTemplates = response.data
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_COMPLETED,
        "payload": { workflowTemplates }
      })
    })
    .catch(err => {
      console.log("err in fetchWorkflowTemplates", err)
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_FAILED
      })
    })
  }
}

export const fetchWrokflowTransitions = (workflowTemplateId) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_IN_PROGRESS
    })
    axios.get(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions?onlyActive=false`)
    .then(response => {
      const transitions = response.data
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED,
        "payload": {
          workflowTemplateId, 
          transitions
        }
      })
    })
    .catch(err => {
      console.log("err in fetchWorkflowTemplates", err)
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TEMPLATES_FAILED
      })
    })
  }
}

export const fetchWorkflowActions = () => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.FETCH_WORKFLOW_ACTIONS_IN_PROGRESS
    })
    axios.get(`${BASE_URL}/v1/templates/action/get/all`)
    .then(response => {
      const actions = response.data
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_ACTIONS_COMPLETED,
        "payload": { actions }
      })
    })
    .catch(err => {
      console.log("err in fetchWorkflowActions", err)
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_ACTIONS_FAILED
      })
    })
  }
}

export const updateTransition = (workflowTemplateId, transition) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.UPDATE_TRANSITION_IN_PROGRESS,
      "payload": {
        workflowTemplateId,
        "transitionId": transition.id
      }
    })
    axios.put(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions`, transition)
    .then(response => {
      dispatch({
        "type": workflowTypes.UPDATE_TRANSITION_COMPLETED,
        "payload": { 
          workflowTemplateId,
          "transitionId": transition.id
        }
      })
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED,
        "payload": {
          workflowTemplateId, 
          transitions: [transition]
        }
      })
    })
    .catch(err => {
      console.log("err in updateTransition", err)
      dispatch({
        "type": workflowTypes.UPDATE_TRANSITION_FAILED,
        "payload": { 
          workflowTemplateId,
          "transitionId": transition.id
        }
      })
    })
  }
}

export const createTransition = (workflowTemplateId, transition) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.CREATE_TRANSITIONS_IN_PROGRESS,
      "payload": {
        workflowTemplateId,
        "transitionId": transition.id
      }
    })
    axios.post(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions`, [transition])
    .then(response => {
      dispatch({
        "type": workflowTypes.CREATE_TRANSITIONS_COMPLETED,
        "payload": { 
          workflowTemplateId,
          "transitionId": transition.id
        }
      })
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED,
        "payload": {
          workflowTemplateId,
          transitions: [transition]
        }
      })
    })
    .catch(err => {
      console.log("err in createTransition", err)
      dispatch({
        "type": workflowTypes.CREATE_TRANSITIONS_FAILED,
        "payload": { 
          workflowTemplateId,
          "transitionId": transition.id
        }
      })
    })
  }
}

export const createTransitions = (workflowTemplateId, transitions, referenceId) => {
  return (dispatch) => {
    dispatch({
      "type": workflowTypes.CREATE_TRANSITIONS_IN_PROGRESS,
      "payload": {
        workflowTemplateId,
        "transitionId": referenceId
      }
    })
    axios.post(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions`, transitions)
    .then(response => {
      dispatch({
        "type": workflowTypes.CREATE_TRANSITIONS_COMPLETED,
        "payload": { 
          workflowTemplateId,
          "transitionId": referenceId
        }
      })
      dispatch({
        "type": workflowTypes.FETCH_WORKFLOW_TRANSITIONS_COMPLETED,
        "payload": {
          workflowTemplateId,
          transitions: transitions,
        }
      })
    })
    .catch(err => {
      console.log("err in createTransitions", err)
      dispatch({
        "type": workflowTypes.CREATE_TRANSITIONS_FAILED,
        "payload": { 
          workflowTemplateId,
          "transitionId": referenceId
        }
      })
    })
  }
}