import clearAction, { CLEAR_STATE } from '../actions/clearAction';

function clearState(state: any, action: any) {
    if (action.type === CLEAR_STATE) {
        return {};
    }
    return state;
}

export default clearState;