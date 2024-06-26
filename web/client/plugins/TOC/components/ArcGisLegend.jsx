import React from 'react';

import PropTypes from 'prop-types';
import { isEmpty, isNumber } from 'lodash';
import ArcGisLegendIcon from './ArcGisLegendIcon';
/**
 * WMSLegend renders the wms legend image
 * @prop {object} node layer node options
 * @prop {object} legendContainerStyle style of legend container
 * @prop {object} legendStyle style of legend image
 * @prop {boolean} showOnlyIfVisible show only if the layer node is visible
 * @prop {number} currentZoomLvl map zoom level
 * @prop {array} scales list of available scales on the map
 * @prop {string} WMSLegendOptions options for the WMS get legend graphic LEGEND_OPTIONS parameter
 * @prop {boolean} scaleDependent if true add the scale parameter to the legend graphic request
 * @prop {string} language current language code
 * @prop {number} legendWidth width of the legend symbols
 * @prop {number} legendHeight height of the legend symbols
 */
class ArcGisLegend extends React.Component {
    static propTypes = {
        node: PropTypes.object,
        legendContainerStyle: PropTypes.object,
        legendStyle: PropTypes.object,
        showOnlyIfVisible: PropTypes.bool,
        currentZoomLvl: PropTypes.number,
        scales: PropTypes.array,
        WMSLegendOptions: PropTypes.string,
        scaleDependent: PropTypes.bool,
        language: PropTypes.string,
        legendWidth: PropTypes.number,
        legendHeight: PropTypes.number
    };

    static defaultProps = {
        legendContainerStyle: {},
        showOnlyIfVisible: false,
        scaleDependent: true
    };

    constructor(props) {
        super(props);
        this.containerRef = React.createRef();
    }
    state = {
        containerWidth: 0,
        legendContainerStyle: {overflowX: "auto"}
    };

    componentDidMount() {
        const containerWidth = this.containerRef.current && this.containerRef.current.clientWidth;
        this.setState({ containerWidth, ...this.state });
    }
    
    render() {
        let node = this.props.node || {};
        console.log("ArcGis Leg Node", node)
        const showLegend = this.canShow(node) && node.type === "arcgis";
        const useOptions = showLegend && this.useLegendOptions();
        if (showLegend) {
            console.log("reached ArcGis Legend")
            return (
                <div style={!this.setOverflow() ? this.props.legendContainerStyle : this.state.legendContainerStyle} ref={this.containerRef}>
                    <ArcGisLegendIcon
                        style={!this.setOverflow() ? this.props.legendStyle : {}}
                        layer={node}
                        currentZoomLvl={this.props.currentZoomLvl}
                        scales={this.props.scales}
                        legendHeight={
                            useOptions &&
                            this.props.node.legendOptions &&
                            this.props.node.legendOptions.legendHeight ||
                            this.props.legendHeight ||
                            undefined
                        }
                        legendWidth={
                            useOptions &&
                            this.props.node.legendOptions &&
                            this.props.node.legendOptions.legendWidth ||
                            this.props.legendWidth ||
                            undefined
                        }
                        legendOptions={this.props.WMSLegendOptions}
                        scaleDependent={this.props.scaleDependent}
                        language={this.props.language}
                    />
                </div>
            );
        }
        return null;
    }

    canShow = (node) => {
        return node.visibility || !this.props.showOnlyIfVisible;
    };

    useLegendOptions = () =>{
        return (
            !isEmpty(this.props.node.legendOptions) &&
            isNumber(this.props.node.legendOptions.legendHeight) &&
            isNumber(this.props.node.legendOptions.legendWidth)
        );
    };

    setOverflow = () => {
        return this.useLegendOptions() &&
            this.props.node.legendOptions.legendWidth > this.state.containerWidth;
    }
}

export default ArcGisLegend;
