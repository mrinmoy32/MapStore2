import React from "react"
import { createPlugin } from "../utils/PluginsUtils"

const style = {
    position: "absolute",
    background: "white",
    top: 50,
    left: 50,
    zIndex: 10000
}

const Component = () => {
    return (
        <div>
            <div style={style}>Hello MapStore</div>
        </div>
    );
}


export default createPlugin("Example", {
    component: Component
})
