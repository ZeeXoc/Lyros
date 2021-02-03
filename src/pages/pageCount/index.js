import React, {Component} from "react";
const config = {
    title: '本站统计',
    draggable: true
}

function PageCount(props) {
    return (
        <>
            <script async src="http://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"/>
            <span id="busuanzi_container_site_pv">
                本站访客数<span id="busuanzi_value_site_uv"/>人次
                本站总访问量<span id="busuanzi_value_site_pv"/>次
            </span>
        </>
    )
}

export {PageCount as Component,config}