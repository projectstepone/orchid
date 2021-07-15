import { createStore, applyMiddleware, combineReducers } from 'redux'
import reduxThunk from 'redux-thunk'

import workflowReducers from '../workflow/workflow.reducers'
import breadcrumbReducers from '../breadcrumb/breadcrumb.reducers'
import authReducers from '../auth/auth.reducers'
import { authMiddleware } from '../auth/auth.middleware'

const createStoreWithMiddleware = applyMiddleware(reduxThunk, authMiddleware)(createStore)

const rootReducer = combineReducers({
	workflow: workflowReducers,
	breadcrumb: breadcrumbReducers,
	auth: authReducers
})

export default createStoreWithMiddleware(rootReducer)
