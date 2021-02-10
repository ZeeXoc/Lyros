import React, { Component } from "react";
import cookie from 'react-cookies';
import { Button } from 'antd';
import { Interval2D } from "./offset";
import { Window } from "./display";

export class EventListener {
    element;

    previousEvent;

    currentEvent;

    setDrag(element, listener) {
        let isMouseDown = false;
        element.addEventListener('mousedown', e => {
            this.previousEvent = e;
            this.currentEvent = e;
            isMouseDown = true;
        })
        document.addEventListener('mousemove', e => {
            if (!isMouseDown) return
            this.currentEvent = e;
            listener(this.previousEvent, this.currentEvent)
        })
        document.addEventListener('mouseup', e => {
            isMouseDown = false;
        })
    }

    constructor(element, type, listener) {
        this.element = element;
        switch (type) {
            case 'drag': {
                this.setDrag(element, listener)
                break;
            }
            default: {
                element.addEventListener(type, listener)
            }
        }

    }
}

export class Container extends Component {
    windows = {
        0: {
            url: '',
            offset: new Interval2D(),
            actions: {}
        },
        urlByHash: {},
        hashByUrl: {}
    }
    loadWindow(url, require,isRewrite) {
        let Win = Window(require);
        let hash = Os.hashCode(url);
        let action;
        this.setState(state => {
            if (isRewrite || !state.windows[hash]) {
                state.windows[hash] =
                    <Win hash={hash} key={hash}
                        action={act => action = act}
                        delete={this.delete.bind(this)} />
            }
            return state
        }, () => {
            this.windows.urlByHash[hash] = url;
            this.windows.hashByUrl[url] = hash;
            this.windows[hash] = {
                url: url,
                action: action
            }
            this.saveCookie()
        });
        return hash
    }

    loadIcon(url, require) { }

    load(url, isRewrite) {
        let req = require('../pages/' + url);
        switch (req.TYPE) {
            case 'window':
                this.loadWindow(url, req,isRewrite);
            case 'icon':
                this.loadIcon(url, req,isRewrite);
        }
    }
    delete(hash) {
        this.setState(state => {
            delete state.windows[hash];
            delete this.windows.hashByUrl[this.windows.urlByHash[hash]];
            delete this.windows.urlByHash[hash];
            delete this.windows[hash];
            return state
        }, () => this.saveCookie());
    }

    saveCookie() {
        let state = {};
        Object.values(this.windows.hashByUrl).forEach(hash => {
            state[hash] = {
                url: this.windows[hash].url,
            }
        })
        Os.cookie('appState', state);
    }

    loadCookie() {
        let c = Os.cookie('appState');
        if (!c) return null;
        for (let hash in c) {
            if (!c.hasOwnProperty(hash)) continue;
            this.load(c[hash].url);
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            windows: {},
            icons: {},
        }
    }

    componentDidMount() {
        this.loadCookie();
    }

    render() {
        return (
            <>
                <Button type="default" onClick={() => this.load('game/')}>game</Button>
                <Button type="default" onClick={() => this.load('text/')}>text</Button>
                <Button type="default" onClick={() => this.load('pageCount/')}>统计</Button>
                {Object.values(this.state.windows)}
                {Object.values(this.state.icons)}
            </>
        )
    }
}


export class Os {
    element;

    static addEventListener(element, type, listener) {
        return new EventListener(element, type, listener)
    }

    static cookie(name, state) {
        if (!name) return cookie.load(name)
        if (!state) return cookie.load(name)
        cookie.save(name
            , state
            , { expires: new Date(new Date().getTime() + 24 * 3600 * 1000 * 15) })//half month
    }

    static hashCode(string) {
        let hash = 0, i, chr;
        if (string.length === 0) return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    static mapChangeObj(map) {
        let obj = {};
        for (let [k, v] of map) {
            obj[k] = v;
        }
        return obj;
    }

    static objChangeMap(obj) {
        let map = new Map();
        for (let key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            map.set(key, obj[key]);
        }
        return map;
    }

    constructor(element) {
        this.element = element;
    }
}
