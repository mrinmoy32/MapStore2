import { TOGGLE_MODAL } from '../actions/center';
// import assign from 'object-assign';

// function center(state = { enabled: false }, action) {
//     switch (action.type) {
//         case TOGGLE_MODAL: {
//             return { enabled: action.enabled };
//         }
//         default:
//             return state;
//     }
// }

function center(state = { enabled: false }, action) {
    switch (action.type) {
        case TOGGLE_MODAL: {
            return { enabled: !state?.enabled };
        }
        default:
            return state;
    }
}

export default center;