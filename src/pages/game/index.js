import React, {Component} from "react";
import {Container} from "../../Lyros";

const config = {
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
            <div style={{color: 'red'}}>
                gjd
            </div>
        );
    }
}

export {Game as Component,config}