import React, { Component } from 'react';
import { Button } from 'antd';
import { Os } from '../index'
import './index.less';

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

        /*setDrag() {
            let pUl = Object.assign({}, { x: this.interval().ul.x, y: this.interval().ul.y });
            let header = this.ref.querySelector('[w-type=\'header</ZoomBlock>\']');
            let previousEvent, currentEvent;
            let isMouseDown = false;
            header.addEventListener('mousedown', e => {
                pUl = Object.assign({}, { x: this.interval().ul.x, y: this.interval().ul.y });
                previousEvent = e;
                currentEvent = e;
                isMouseDown = true;
            })
            document.addEventListener('mousemove', e => {
                if (!isMouseDown) return
                currentEvent = e;
                this.interval().translate(Point2D.minus(currentEvent, previousEvent).add(pUl))
            })
            document.addEventListener('mouseup', e => {
                pUl = Object.assign({}, { x: this.interval().ul.x, y: this.interval().ul.y });
                isMouseDown = false;
            })
        }*/
        setDrag = () => Os.setDrag(
            e => this.setState({ style: {...this.state.style,...e} }),
            this.ref,
            this.ref.querySelector('[w-type=\'header\']'),
            document.getElementById('root')
        )
        constructor(props) {
            super(props);
            this.state = {
                title: this.config.title,
                style: {}
            }
        }

        componentDidMount() {
            // //在此声明防止interval提前与offset绑定
            // this.#_interval = new Interval2D(null, {
            //     limit: document.getElementsByTagName('body')[0],
            //     onChange: interval => this.setState({ style: { ...interval.toOffset() } })
            // });
            // this.interval(Interval2D.toInterval2D(this.ref))
            // if (this.config.draggable) this.setDrag();
            // this.props.action({
            //     interval: newInterval => this.interval(newInterval),
            // })
            if (this.config.draggable) this.setDrag()
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
                    <Footer >
                        {/*<ZoomBlock e={this.ref} pStyle={style => style?
                            this.setState({ style:{...this.state.style,...style}})
                        :this.state.style} />*/}
                    </Footer>
                </div>
            )
        }
    }

}

export { Window };

function Header(props) {
    return (<div
        style={{ ...props.style }}
        w-type='header'>
        {props.children}
    </div>)
}
function Title(props) {
    return <span>{props.children}</span>;
}
function DeleteButton(props) {
    return <Button type="default" onClick={props.delete}>×</Button>;
}
function Body(props) {
    return (
        <div
            style={{ ...props.style }}
            w-type='body'>
            {props.children}
        </div>
    )
}

function Footer(props) {
    return (<div
        style={{ ...props.style }}
        w-type='footer'>
        <span>{props.title}</span>
        {props.children}
    </div>)
}

/*class ZoomBlock extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    componentDidMount(){
        Os.setDrag(e=>{
            this.props.pStyle({
                width:this.ref.offsetLeft+this.ref.offsetWidth,
                height:this.ref.offsetTop+this.ref.offsetHeight
            })
            this.setState({style:e});
        },this.ref,this.ref,this.props.e)
    }
    render() {
        return (
            <div style={this.state.style} ref={ref=>this.ref = ref}>
                <span>dfasdfasdfedf</span>   </div>
        )
    }
}*/