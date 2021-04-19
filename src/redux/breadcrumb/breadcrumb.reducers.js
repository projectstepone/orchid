import { produce } from 'immer'
import * as breadcrumbTypes from './breadcrumb.types'

const initialState = {
  breadcrumbs: []
}

const push = (state, { payload: { breadcrumb }}) => {
  return produce(state, draftState => {
    const len = draftState.breadcrumbs.filter(bc => {
      if (bc.title === breadcrumb.title) {
        return true
      }
      return false
    }).length
    if (len !== 0) {
      draftState.breadcrumbs.pop()
    } else {
      draftState.breadcrumbs.push(breadcrumb)
    }
  })
}

const pop = (state, action) => {
  return produce(state, draftState => {
    draftState.breadcrumbs.pop()
  })
}

const handlers = {
  [breadcrumbTypes.BREADCRUMB_PUSH]: push,
  [breadcrumbTypes.BREADCRUMB_POP]: pop
}

export default (state = initialState, action) => {
  console.log("[breadcrumb][actions]", action)
  if(handlers[action.type]) {
    const nextState = handlers[action.type](state, action)
    console.log("breadcrumb next state", nextState)
    return nextState
  }
  return state
}