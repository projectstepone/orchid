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
    axios.get(`${BASE_URL}/v1/templates/workflow/${workflowTemplateId}/transitions`)
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