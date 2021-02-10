import React,{Component} from 'react';
import {EventListener} from '../index';
import {Interval2D} from '../offset'
import './index.css';

const WINDOW_DEFAULT_CONFIG = {
    title: 'window',
    draggable: true
}

function Window(require) {
    let config = require.CONFIG;
    let WrappedComponent = require.Component;
    return class extends Component {
        //DOM element
        ref;

        config = {
            ...Object.assign({}, WINDOW_DEFAULT_CONFIG, config),
            hash: this.props.hash
        }

        #_interval;

        interval(newInterval) {
            if (!newInterval) return this.#_interval
            this.#_interval.set(newInterval);
            return this.#_interval;
        }

        setDrag() {
            let pUl = Object.assign({}, { x: this.interval().ul.x, y: this.interval().ul.y });
            let header = this.ref.querySelector('[w-type=\'header\']');
            new EventListener(header, 'mousedown', (pE, cE) => {
                pUl = Object.assign({}, { x: this.interval().ul.x, y: this.interval().ul.y });
            })
            new EventListener(header, 'drag', (pE, cE) => {
                this.interval().translate({
                    x: pUl.x + cE.x - pE.x,
                    y: pUl.y + cE.y - pE.y
                })
            })
            new EventListener(header, 'mouseup', (pE, cE) => {
                pUl = Object.assign({}, { x: this.interval().ul.x, y: this.interval().ul.y });
            })
        }

        constructor(props) {
            super(props);
            this.state = {
                title: this.config.title,
                style: {}
            }
        }

        componentDidMount() {
            //在此声明防止interval提前与offset绑定
            this.#_interval = new Interval2D(null, {
                limit: document.getElementsByTagName('body')[0],
                onChange: interval => this.setState({ style: { ...interval.toOffset() } })
            });
            this.interval(Interval2D.toInterval2D(this.ref))
            if (this.config.draggable) this.setDrag();
            this.props.action({
                interval: newInterval => this.interval(newInterval),
                temp: 'temp'
            })
        }


        render() {
            return (
                <div
                    className='app-window'
                    id={'app-window-' + this.config.title}
                    style={this.state.style}
                    ref={ref => this.ref = ref}>
                    <Header>
                        <Title>{this.state.title}</Title>
                        <DeleteButton delete={() => this.props.delete(this.config.hash)} />
                    </Header>
                    <Body>
                        <WrappedComponent />
                    </Body>
                    <Footer />
                </div>
            )
        }
    }

}

export {Window};

function Header(props) {
    return (<div
        style={{...props.style}}
        w-type='header'>
        {props.children}
    </div>)
}
function Title(props) {
    return <span>{props.children}</span>;
}
function DeleteButton(props) {
    return <button onClick={props.delete}>×</button>;
}
function Body(props) {
    return (
        <div
            style={{...props.style}}
            w-type='body'>
            {props.children}
        </div>
    )
}

function Footer(props) {
    return (<div
        style={{...props.style}}
        w-type='footer'>
        <span>{props.title}</span>
        {props.children}
    </div>)
}

export {Header,Body,Footer,Title,DeleteButton};