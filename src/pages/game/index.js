import React, { Component } from "react";

export const TYPE = 'window'

export const CONFIG = {
    title: 'game',
    draggable: true
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div style={{ color: 'red' }}>
                gjd
            </div>
        );
    }
}

export { Game as Component }