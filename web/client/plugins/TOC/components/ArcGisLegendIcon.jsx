import PropTypes from "prop-types";
import React from "react";
import Message from "../../../components/I18N/Message";

/**
 * Legend renders the wms legend image
 * @prop {object} layer layer options
 * @prop {object} style style of legend image
 * @prop {number} currentZoomLvl map zoom level
 * @prop {array} scales list of available scales on the map
 * @prop {string} legendOptions options for the WMS get legend graphic LEGEND_OPTIONS parameter
 * @prop {boolean} scaleDependent if true add the scale parameter to the legend graphic request
 * @prop {string} language current language code
 * @prop {number} legendWidth width of the legend symbols
 * @prop {number} legendHeight height of the legend symbols
 */
class ArcGisLegendIcon extends React.Component {
    static propTypes = {
        layer: PropTypes.object,
        legendHeight: PropTypes.number,
        legendWidth: PropTypes.number,
        legendOptions: PropTypes.string,
        style: PropTypes.object,
        currentZoomLvl: PropTypes.number,
        scales: PropTypes.array,
        scaleDependent: PropTypes.bool,
        language: PropTypes.string,
    };

    static defaultProps = {
        legendHeight: 12,
        legendWidth: 12,
        legendOptions: "forceLabels:on",
        style: { maxWidth: "100%" },
        scaleDependent: true,
    };
    state = {
        error: false,
        legends: [],
    };
    UNSAFE_componentWillReceiveProps(nProps) {
        if (
            this.state.error &&
            this.getUrl(nProps, 0) !== this.getUrl(this.props, 0)
        ) {
            this.setState(() => ({ error: false }));
        }
    }
    async componentDidMount() {
        if (this.props.layer.type === "arcgis") {
            await this.fetchArcgisLegend();
        }
    }

    async fetchArcgisLegend() {
        const { layer } = this.props;
        try {
            const response = await fetch(`${layer.url}/legend?f=pjson`);
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.statusText}`
                );
            }
            const responseData = await response.json();
            const legends = responseData.layers[layer.name].legend;
            this.setState({ legends });
            console.log("updated state", this.state);
        } catch (error) {
            console.error("Error fetching legend data:", error);
            this.setState({ error: true });
        }
    }
    onImgError = () => {
        this.setState({ error: true }, () => {
            console.log("Image Load err");
        });
    };
    getScale = (props) => {
        if (
            props.scales &&
            props.currentZoomLvl !== undefined &&
            props.scaleDependent
        ) {
            const zoom = Math.round(props.currentZoomLvl);
            const scale =
                props.scales[zoom] ?? props.scales[props.scales.length - 1];
            return Math.round(scale);
        }
        return null;
    };
    getUrl = (props) => {
        if (props.layer && props.layer.type === "arcgis" && props.layer.url) {
            return `data:image/png;base64,${this.state.legends}`;
        }
        return "";
    };
    render() {
        if (
            !this.state.error &&
            this.props.layer &&
            this.props.layer.type === "arcgis" &&
            this.state.legends &&
            this.props.layer.url
        ) {
            return this.state.legends.map((legend, index) => (
                <li key={index}>
                    <img className="arcgis_legend_image"
                        onError={this.onImgError}
                        onLoad={(e) => this.validateImg(e.target)}
                        src={`data:image/png;base64,${legend.imageData}`}
                        style={this.props.stysle}
                    />
                    <span>{legend.label}</span>
                </li>
            ));
        }
        return <Message msgId="layerProperties.legenderror" />;
    }
    validateImg = (img) => {
        // GeoServer response is a 1x2 px size when legend is not available.
        // In this case we need to show the "Legend Not available" message
        console.log(`Image Dimension: ${img.width}x${img.height}`);
        if (img.height <= 1 && img.width <= 2) {
            this.onImgError();
        }
    };
}

export default ArcGisLegendIcon;
