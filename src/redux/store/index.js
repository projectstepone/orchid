import { createStore, applyMiddleware, combineReducers } from 'redux';
import reduxThunk from 'redux-thunk';

import workflowReducers from '../workflow/workflow.reducers';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

const rootReducer = combineReducers({
	workflow: workflowReducers
})

export default createStoreWithMiddleware(rootReducer)
