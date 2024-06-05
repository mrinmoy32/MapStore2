import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import Message from '../components/I18N/Message';
import { createSelector } from 'reselect';
import { mapSelector } from '@mapstore/framework/selectors/map';
import { createPlugin } from "../utils/PluginsUtils"
import { toggleModal } from '../actions/center';
import centerReducers from '../reducers/center'; 

// import Tooltip from 'react-tooltip';

// const toggleCenterTool = toggleControl.bind(null, 'click', null);

// const TOGGLE_MODAL = 'TOGGLE_MODAL';

// function toggleModal() {
//     return {
//         type: TOGGLE_MODAL,
//         // enabled: enabled
//     };
// }

// function centerReducer(state = { enabled: false }, action) {
//     switch (action.type) {
//         case TOGGLE_MODAL: {
//             return { enabled: !state?.enabled };
//         }
//         default:
//             return state;
//     }
// }

function MyGeoNodeExtension({
    center, enabled
}) {
    // const [modalOpen, setModalOpen] = useState(false);
    console.log("enabled:", enabled)
    return (
        enabled ? (<div
            className="shadow"
            style={{
                position: 'absolute',
                zIndex: 100,
                top: 83,
                margin: 8,
                right: 39,
                backgroundColor: '#ffffff',
                padding: 8,
                textAlign: 'center',
                // transform: 'translateX(-50%)'
            }}
        >
            <div>
                <small>
                    Map Center ({center.crs})
                </small>
            </div>
            <div>
                x: <strong>{center?.x?.toFixed(6)}</strong>
                {' | '}
                y: <strong>{center?.y?.toFixed(6)}</strong>
            </div>
        </div>) : null
    );
}

MyGeoNodeExtension.propTypes = {
    center: PropTypes.object,
    enabled: PropTypes.bool
};

MyGeoNodeExtension.defaultProps = {
    center: {},
    enabled: false
};

const MyGeoNodeExtensionPlugin = connect(
    createSelector([
        mapSelector,
        state => state?.center?.enabled || false
    ], (map, enabled) => ({
        center: map?.center,
        enabled
    }))
    , {}
)(MyGeoNodeExtension);


export default createPlugin("Center", {
    component: MyGeoNodeExtensionPlugin,
    containers: {
        Toolbar: {
            name: 'center',
            position: 32,
            help: <Message msgId="helptexts.center" />,
            tooltip: "Center",
            icon: <Glyphicon glyph="record" />,
            exclusive: true,
            panel: true,
            priority: 1
        },
        BurgerMenu: {
            name: 'center',
            position: 32,
            tooltip: "Center",
            text: <Message msgId="Center" />,
            icon: <Glyphicon glyph="record" />,
            // action: toggleControl.bind(null, 'center', null),
            priority: 3,
            doNotHide: true
        },
        SidebarMenu: {
            name: "center",
            position: 32,
            tooltip: "Center",
            text: <Message msgId="Center" />,
            icon: <Glyphicon glyph="record" />,
            action: toggleModal,
            // onclick: () => {setModalOpen(!modalOpen)},
            doNotHide: true,
            // toggle: true,
            // toggleControl: 'center',
            // toggleProperty: 'enabled',
            priority: 2
        }
    },
    epics: {},
    reducers: { center: centerReducers }
})