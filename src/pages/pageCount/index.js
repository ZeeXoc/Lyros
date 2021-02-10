import React, { Component } from "react";
import Script from 'react-load-script';

const config = {
    title: '本站统计',
    draggable: true
}

class PageCount extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoad:false
        }
    }
    render() {
        return (
            <>
                {/*不蒜子统计 */}
                <Script
                    url="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
                    onLoad={() => this.setState({isLoad:true})}
                />
                {this.state.isLoad ?
                    <span id="busuanzi_container_site_pv">
                        本站访客数<span id="busuanzi_value_site_uv" />人次
                        本站总访问量<span id="busuanzi_value_site_pv" />次
                    </span> 
                    : <span>加载中</span>
                }
            </>
        )
    }
}

export { PageCount as Component, config }