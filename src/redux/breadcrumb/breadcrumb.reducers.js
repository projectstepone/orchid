import { produce } from 'immer'
import * as breadcrumbTypes from './breadcrumb.types'

const initialState = {
  breadcrumbs: []
}

const push = (state, { payload: { path }}) => {
  return produce(state, draftState => {
    const parts = path.split("/")
    if(draftState.breadcrumbs.length < parts.length) {
      
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