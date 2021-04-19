import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxThunk from 'redux-thunk';

import workflowReducers from '../workflow/workflow.reducers';
import breadcrumbReducers from '../breadcrumb/breadcrumb.reducers'

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

const rootReducer = combineReducers({
	workflow: workflowReducers,
	breadcrumb: breadcrumbReducers
})

export default createStoreWithMiddleware(rootReducer)
