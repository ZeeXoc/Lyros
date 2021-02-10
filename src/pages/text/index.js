/**
 * Created by xing on 2017/5/17.
 */
import React from 'react';
import d3 from 'd3-3';

const config = {
    title: '算法可视化',
    draggable: true
}

const colorRed = "#ff3d00";
const COLOR_SELECTED = "#ff9100";
const COLOR_DEFAULT = "#00897b";
const colorGreen = "#00e676";
const SPEED = 0;
const SIZE = 100

function getSortData(count=SIZE){
    let arr = [], i=0;
    while(i++<count){
        let v = Math.floor((Math.random()*90+10));//10~100
        arr.push({v:v,color:COLOR_DEFAULT});
    }
    return arr;
}

class Sort extends React.Component{
    constructor(props){
        super(props);
        this.state = {"data":getSortData()};//设置state
    }
    render(){
        return (
            <div className="col s12 m12">
                <div className="row">
                    <div className="input-field col s12 m4">
                        <select id="select">
                            <option value="bubble">冒泡排序</option>
                            <option value="select">选择排序</option>
                            <option value="insertion">插入排序</option>
                            <option value="mergeSort">归并排序</option>
                            <option value="quickSort">快速排序</option>
                        </select>
                        <label>请选择排序算法</label>
                        <button className="btn" onClick={this.handleStart.bind(this)}>开始</button>
                        <button className="btn" onClick={this.handleReset.bind(this)}>重置</button>
                    </div>
                    <div className="col s12 m12 l12">
                        <div style={{width:"100%",display:"flex",justifyContent:'center'}}>
                            <SortGraph data={this.state.data}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleReset(){
        this.setState( (prevState) => {return {"data":getSortData()}});
        //console.log("handleReset",...this.state.data);
    }
    handleStart(){
        let select = document.getElementById("select").value;//materialize的问题
        //console.log("handleStart",select);
        if(!SortalGorithm.hasOwnProperty(select)){
            alert("无该排序方法");
            return;
        }
        //console.log(this.props);
        /****************颜色归一**************/
        let data = this.state.data.slice();
        resetColor(data);
        /************处理各种算法**************/
        let iter = SortalGorithm[select](data);
        let go = ()=> {
            let currentData = iter.next();
            //console.log("next", currentData);
            if(!currentData.done){
                this.setState( (prevState) => {return {"data":currentData.value}});
                setTimeout(go,SPEED);
            }
        }
        setTimeout(go,0);
    }
}

function resetColor(data){
    data.forEach(v=>{v.color=COLOR_DEFAULT;});
}

const SortalGorithm = {
    bubble: function* (data){
        let length = data.length;
        for(let i=0;i<length;i++){
            for(let j=0;j<length-1;j++){
                data[j].color = COLOR_SELECTED;
                yield data;
                if(data[j].v>data[j+1].v){
                    //交换
                    data[j].color = data[j+1].color = colorRed;
                    yield data;
                    let t = data[j].v;
                    data[j].v = data[j+1].v;
                    data[j+1].v = t;
                    //console.log("交换");
                    yield data;
                }
                resetColor(data);
            }
        }
    },
    select: function* (data){
        let length = data.length, indexMin;
        for(let i=0;i<length-1;i++){
            indexMin = i;
            for(let j=i;j<length;j++){
                data[j].color = COLOR_SELECTED;
                yield data;
                if(data[indexMin].v>data[j].v){
                    indexMin = j;
                }
                resetColor(data);
            }
            if(i!==indexMin){
                //交换
                data[indexMin].color = data[i].color = colorRed;
                yield data;
                let t = data[indexMin].v;
                data[indexMin].v = data[i].v;
                data[i].v = t;
                console.log("交换");
                yield data;
            }
            resetColor(data);
        }
    },
    insertion: function* (data){
        let length = data.length,j,temp;
        for(let i=1;i<length;i++){
            j = i;
            temp = data[i];
            data[j].color = COLOR_SELECTED;
            yield data;
            resetColor(data);
            while(j>0&&data[j-1].v>temp.v){
                data[j] = data[j-1];
                j--;
            }
            if(i!==j){
                data[j] = temp;
                data[j].color = colorRed;
                data[i].color = colorRed;
                yield data;
                resetColor(data);
            }
        }
    },
    mergeSort: function* (data){
        let mergeRec = function*(arr){
            let length = arr.length;
            if(length===1){
                return arr;
            }
            let mid = Math.floor(length/2),
                left = arr.slice(0, mid),
                right = arr.slice(mid, length);

            left.forEach((v)=>{
                v.color = COLOR_DEFAULT;
            });

            right.forEach((v)=>{
                v.color = COLOR_SELECTED;
            });

            //console.log("data", data);
            yield data;

            let mleft = yield*  mergeRec(left);
            let mright = yield*  mergeRec(right);

            let m = yield*  merge(mleft, mright);
            return m;

        };
        let merge = function*(left, right){
            if(!left||!right)return;
            let result = left.concat(right),//保留原始数据引用
                re = [];//排序后的数组
            //console.log("merge",result);
            let il = 0,
                ir = 0;
            right = right.map(v=>v.v);
            left = left.map(v=>v.v);
            while(il<left.length&&ir<right.length){
                if(left[il]<right[ir]){
                    re.push(left[il++]);
                }else{
                    re.push(right[ir++]);
                }
            }
            while(il<left.length){
                re.push(left[il++]);
            }
            while(ir<right.length){
                re.push(right[ir++]);
            }
            result.forEach((v,i)=>{
                result[i].v = re[i];
                v.color = colorGreen;
            });
            //console.log("merge result",result);
            yield data;
            return result;
        };

        yield* mergeRec(data);
    },
    quickSort: function*(data){

        let quick = function* (data,left,right){
            let index;
            if(data.length>1){
                index = yield* partition(data,left,right);
                if(left<index-1){
                    yield* quick(data,left,index-1);
                }
                if(index<right){
                    yield* quick(data,index,right);
                }
            }
        };
        let partition = function* (data,left,right){
            let pivot = data[Math.floor((right+left)/2)],
                j = right,
                i = left;

            pivot.color = colorGreen;
            data[left].color = data[right].color = colorGreen;
            yield data;
            resetColor(data);

            while(i<=j){
                while(data[i].v<pivot.v){
                    i++;

                    pivot.color = colorGreen;
                    data[left].color = data[right].color = colorGreen;
                    data[i].color = data[j].color = COLOR_SELECTED;
                    yield data;
                    resetColor(data);
                }
                while(data[j].v>pivot.v){
                    j--;

                    pivot.color = colorGreen;
                    data[left].color = data[right].color = colorGreen;
                    data[i].color = data[j].color = COLOR_SELECTED;
                    yield data;
                    resetColor(data);
                }
                if(i<=j){
                    let temp = data[i];
                    data[i] = data[j];
                    data[j] = temp;

                    pivot.color = colorGreen;
                    data[left].color = data[right].color = colorGreen;
                    data[i].color = data[j].color = COLOR_SELECTED;
                    yield data;
                    resetColor(data);

                    i++;
                    j--;
                }
            }
            return i;
        };

        yield* quick(data,0,data.length-1);
    }
};

class SortGraph extends React.Component{
    render(){
        //svg宽高
        let paddingBottom = 30;
        let height = 400;
        let data = this.props.data;
        //求比例变换
        let dataV = data.map(v=>{return v.v});
        //let min = Math.min(...dataV);
        let max = Math.max(...dataV);
        //console.log("render SortGraph",{max,min});
        let linear = d3.scale.linear().domain([0,max]).range([0,height-paddingBottom-10]);
        let w = 5;
        let dom = data.map((value, i)=>{
            let h = linear(value.v);
            let x = i*(w+5);
            let y = height - h - paddingBottom;
            return (
                <g key={i}>
                    <Bar x={x} y={y}  width={w} height={h} fill={value.color}/>
                    <text x={x} y={y-2} dx={w/2} textAnchor="middle">{value.v}</text>
                </g>);
        });
        let width = (w+5)*data.length;
        return (
            <svg height={height} width={width} style={{paddingTop:'20px'}} className="center-align">
                <g>
                    {dom}
                </g>
            </svg>)
    }
}

class Bar extends React.Component{
    render(){
        return(
            <rect x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height} fill={this.props.fill}/>
        );
    }
}

export {Sort as Component,config};