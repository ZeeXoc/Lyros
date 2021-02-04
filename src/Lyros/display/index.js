import React from "react";
import './index.css';

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

export {Header,Body,Footer,Title,DeleteButton}