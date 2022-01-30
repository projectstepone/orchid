import { createSelector } from 'reselect'

import { forceSimulation, forceLink, forceCenter, forceManyBody, forceCollide } from 'd3-force'

const DEFAULT_ACTION_PROGRESS = {
  processing: false,
  completed: false,
  failed: false,
  message: ""
}

const selectWorkflowTemplatesByIds = state => state.workflow.workflowTemplatesById

const selectWorkflowActionsByIds = state => state.workflow.workflowActionsById

const selectTransitionsByWorkflowTemplateIds = state => state.workflow.transitionsByWorkflowTemplateId

const selectWorkflowTransitionsByIds = state => state.workflow.workflowTransitionsById

const selectActionCreateProgress = state => state.workflow.actionCreateProgress

const selectActionUpdateProgress = state => state.workflow.actionUpdateProgress

const selectTransitionUpdateProgress = state => state.workflow.transitionUpdateProgress

const selectTransitionCreateProgress = state => state.workflow.transitionCreateProgress

const selectWorkflowTemplateUpdateProgress = state => state.workflow.workflowTemplateUpdateProgress

const selectWorkflowTemplateCreateProgress = state => state.workflow.workflowTemplateCreateProgress

export const selectWorkflowTemplateById = createSelector(
  [
    selectWorkflowTemplatesByIds,
    (_, id) => id
  ],
  (workflowTemplatesByIds, id) => {
    return workflowTemplatesByIds[id]
  }
)

export const selectWorkflowTemplates = createSelector(
  [
    selectWorkflowTemplatesByIds
  ],
  (workflowTemplatesByIds) => {
    return Object.keys(workflowTemplatesByIds).map(id => workflowTemplatesByIds[id])
  }
)

export const selectWorkflowActionById = createSelector(
  [
    selectWorkflowActionsByIds,
    (_, id) => id
  ],
  (workflowActionsByIds, id) => {
    return workflowActionsByIds[id]
  }
)

export const selectWorkflowActions = createSelector(
  [
    selectWorkflowActionsByIds
  ],
  (workflowActionsByIds) => {
    return Object.keys(workflowActionsByIds).map(id => workflowActionsByIds[id])
  }
)

export const selectWorkflowActionTemplates = createSelector(
  [
    selectWorkflowActionsByIds
  ],
  (workflowActionsByIds) => {
    return Object.keys(workflowActionsByIds).map(id => ({ title: id }))
  }
)

export const selectTransitionsByWorkflowTemplateId = createSelector(
  [
    selectTransitionsByWorkflowTemplateIds,
    (_, workflowTemplateId) => workflowTemplateId,
    selectWorkflowTransitionsByIds
  ],
  (transitionsByWorkflowTemplateIds, workflowTemplateId, workflowTransitionsByIds) => {
    if (transitionsByWorkflowTemplateIds[workflowTemplateId]) {
      const transitionIds = Object.keys(transitionsByWorkflowTemplateIds[workflowTemplateId])
      return transitionIds.map(transitionId => workflowTransitionsByIds[transitionId])
        .filter(transition => transition !== undefined)
    }
    return []
  }
)

export const selectRootNode = createSelector(
  [
    selectWorkflowTemplateById,    
  ],
  (workflowTemplate) => {
    if (workflowTemplate) {
      return {
        name: workflowTemplate.startState.name,
        state: workflowTemplate.startState.name,
        rootNode: true,
        terminal: workflowTemplate.startState.terminal
      }
    }
    return {
      name: 'NA',
      state: 'NA',
      rootNode: false,
      terminal: false
    }
  }
)

export const selectOutgoingTransitions = createSelector(
  [
    (state, workflowTemplateId, fromState) => fromState,
    selectTransitionsByWorkflowTemplateId,
  ],
  (fromState, transitions) => {
    return transitions.filter(transition => transition.fromState === fromState)
  }
)

export const selectChildNodes = createSelector(
  [
    selectOutgoingTransitions,
  ],
  (outgoingTransitions) => {
    return outgoingTransitions.map(transition => {
      return {
        name: transition.toState.name,
        state: transition.toState.name,
        rootNode: false,
        terminal: transition.toState.terminal
      }
    })
  }
)

export const selectAllActions = createSelector(
  [
    selectWorkflowActionsByIds
  ],
  (workflowActionsByIds) => {
    return Object.keys(workflowActionsByIds).map(key => ({ id: key }))
  }
)

export const selectStatesByWorkflowTemplateId = createSelector(
  [
    selectRootNode,
    selectTransitionsByWorkflowTemplateId
  ],
  (rootNode, transitions) => {
    let queue = []
    const visitedNode = {}
    queue.push(rootNode)
    const states = []
    while (queue.length !== 0) {
      let qSize = queue.length
      while (qSize !== 0) {
        const visitingNode = queue.shift()
        if (!(visitingNode.name in visitedNode)) {
          const childNodes = transitions
            .filter(transition => transition.fromState === visitingNode.state)
            .map(transition => {
              return {
                name: transition.toState.name,
                state: transition.toState.name,
                rootNode: false,
                terminal: transition.toState.terminal
              }
            })
          queue = queue.concat(childNodes)
          visitedNode[visitingNode.name] = true
          states.push({
            name: visitingNode.name,
            state: visitingNode.state,
            terminal: visitingNode.terminal,
            rootNode: visitingNode.rootNode
          })
        }
        qSize--
      }
    }
    return states
  }
)

const selectSimulationNodes = createSelector(
  [
    selectTransitionsByWorkflowTemplateId
  ],
  (transitions) => {
    const stateSet = new Set()
    const nodes = []
    transitions.forEach(transition => {
      const fromState = transition['fromState']
      const toState = transition['toState']['name']
      if (!stateSet.has(fromState)) {
        stateSet.add(fromState)
        nodes.push({
          id: fromState
        })
      }
      if (!stateSet.has(toState)) {
        stateSet.add(toState)
        nodes.push({
          id: toState
        })
      }
    })
    return nodes
  }
)

const selectSimulationLinks = createSelector(
  [
    selectTransitionsByWorkflowTemplateId
  ],
  (transitions) => {
    const links = []
    transitions.forEach(transition => {
      const fromState = transition['fromState']
      const toState = transition['toState']['name']
      links.push({
        "source": fromState,
        "target": toState
      })
    })
    return links
  }
)

export const selectSimulationResult = createSelector(
  [
    selectSimulationNodes,
    selectSimulationLinks
  ],
  (nodes, links) => {
    const simulation = forceSimulation(nodes)
      .force("link", forceLink(links).id(d => d.id))
      .force("center", forceCenter(window.screen.width/2, window.screen.height/2))
      .force("charge", forceManyBody().strength(-100))
      .force('collide', forceCollide().radius(300))
      .stop()
    simulation.tick(4)
    simulation.stop()
    const map = {}
    simulation.nodes().forEach(node => {
      map[node.id] = node
    })
    return map
  }
)

export const selectTransitionUpdateProgressByTransitionId = createSelector(
  [
    selectTransitionUpdateProgress,
    (_, worflowTemplateId, transitionId) => [worflowTemplateId, transitionId]
  ],
  (transitionUpdateProgress, [worflowTemplateId, transitionId]) => {
    if (!transitionUpdateProgress[worflowTemplateId] || !transitionUpdateProgress[worflowTemplateId][transitionId]) {
      return DEFAULT_ACTION_PROGRESS
    }
    return transitionUpdateProgress[worflowTemplateId][transitionId]  
  }
)

export const selectReactFlowElements = createSelector(
  [
    selectRootNode,
    selectTransitionsByWorkflowTemplateId,
    selectStatesByWorkflowTemplateId,
    selectTransitionUpdateProgressByTransitionId,
    selectAllActions,
    selectSimulationResult,
    (state, workflowTemplateId, transitionId) => transitionId
  ],
  (rootNode, transitions, states, progress, actions, positionMap, transitionId) => {
    const elements = []
    if (!rootNode.rootNode) {
      return []
    }
    let queue = []
    const visitedNode = {}
    queue.push(rootNode)
    while (queue.length !== 0) {
      let qSize = queue.length
      while (qSize !== 0) {
        const visitingNode = queue.shift()
        if (!(visitingNode.name in visitedNode) && (visitingNode.name in positionMap)) {
          elements.push({
            id: visitingNode.name,
            data: { label: visitingNode.name },
            position: { x: positionMap[visitingNode.name].x, y: positionMap[visitingNode.name].y }
          })
          const childNodes = transitions
            .filter(transition => transition.fromState === visitingNode.state)
            .map(transition => {
              return {
                name: transition.toState.name,
                state: transition.toState.name,
                rootNode: false,
                terminal: transition.toState.terminal
              }
            })
          queue = queue.concat(childNodes)
          const edges = transitions.filter(transition => transition.fromState === visitingNode.state)
          edges.forEach(edge => {
            elements.push({
              id: edge.id,
              source: visitingNode.name,
              target: edge.toState.name,
              animated: edge.active,
              type: 'custom',
              data: {
                transition: edge,
                onTransitionUpdate: () => {},
                updating: transitionId === edge.id,
                states: states,
                updateProgress: transitionId === edge.id ? progress : {},
                actions: actions
              },
              arrowHeadType: 'arrow'
            })
          })
          visitedNode[visitingNode.name] = true
        }
        qSize--
      }
    }
    if (elements.length === 0) {
      elements.push({
        id: rootNode.name,
        data: { label: rootNode.name },
        position: { x: window.screen.width / 2, y: window.screen.height / 2 - 100 }
      })
    }
    return elements
  }
)

export const selectTransitionCreateProgressByTransitionId = createSelector(
  [
    selectTransitionCreateProgress,
    (_, worflowTemplateId, transitionId) => [worflowTemplateId, transitionId]
  ],
  (transitionCreateProgress, [worflowTemplateId, transitionId]) => {
    if (!transitionCreateProgress[worflowTemplateId] || !transitionCreateProgress[worflowTemplateId][transitionId]) {
      return DEFAULT_ACTION_PROGRESS
    }
    return transitionCreateProgress[worflowTemplateId][transitionId]  
  }
)

export const selectWorkflowCreateProgressByName = createSelector(
  [
    selectWorkflowTemplateCreateProgress,
    (_, name) => name
  ],
  (workflowTemplateCreateProgress, name) => {
    if (!workflowTemplateCreateProgress[name]) {
      return DEFAULT_ACTION_PROGRESS
    }
    return workflowTemplateCreateProgress[name]
  }
)

export const selectWorkflowUpdateProgressByTemplateId = createSelector(
  [
    selectWorkflowTemplateUpdateProgress,
    (_, templateId) => templateId
  ],
  (workflowTemplateUpdateProgress, templateId) => {
    if (!workflowTemplateUpdateProgress[templateId]) {
      return DEFAULT_ACTION_PROGRESS
    }
    return workflowTemplateUpdateProgress[templateId]
  }
)

export const getWorkflowUpdateProgress = (state, templateId) => {
  const workflowTemplateUpdateProgress = state.workflow.workflowTemplateUpdateProgress
  if (!workflowTemplateUpdateProgress[templateId]) {
    return DEFAULT_ACTION_PROGRESS
  }
  return workflowTemplateUpdateProgress[templateId]
}

export const selectActionUpdateProgressByTemplateId = createSelector(
  [
    selectActionUpdateProgress,
    (_, templateId) => templateId
  ],
  (actionUpdateProgress, templateId) => {
    if (!actionUpdateProgress[templateId]) {
      return DEFAULT_ACTION_PROGRESS
    }
    return actionUpdateProgress[templateId]
  }
)

export const selectActionCreateProgressByTemplateId = createSelector(
  [
    selectActionCreateProgress,
    (_, templateId) => templateId
  ],
  (actionCreateProgress, templateId) => {
    if (!actionCreateProgress[templateId]) {
      return DEFAULT_ACTION_PROGRESS
    }
    return actionCreateProgress[templateId]
  }
)

export const selectWorkflowTemplateByTemplateName = createSelector(
  [
    selectWorkflowTemplates,
    (_, templateName) => templateName
  ],
  (worklfowTemplates, templateName) => {
    return worklfowTemplates
      .filter(workflowTemplate => workflowTemplate.name === templateName)[0]
  }
)