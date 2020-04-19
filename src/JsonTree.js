import React, { Component } from 'react';
import './editor.css';


class JsonLeaf extends Component{

    /* -------------------------
    *  del
    *  -------------------------
    *  @Description: Delete this json leaf node     删除此json叶子节点
    *  @Params: 
    *  @Returns: void
    */
    del = () =>{ 
        if(this.props.del){
            this.props.del([this.props.jsonKey]);
        }
    }

    /* -------------------------
    *  addChild
    *  -------------------------
    *  @Description: Add child node in this leaf node      在此json叶子节点增加子节点
    *  @Params: 
    *  @Returns: void
    */
   addChild = () =>{ 
        if(this.props.add){
            this.props.add([this.props.jsonKey]);
        }
    }

    /* -------------------------
    *  mod
    *  -------------------------
    *  @Description: Modify value of this leaf node      更改此json叶子节点的值
    *  @Params: 
    *       -  e   <event>   The event object.     触发的事件对象  
    *  @Returns: void
    */ 
    mod = (e) =>{
        if(this.props.mod){
            this.props.mod(e.target.value,[this.props.jsonKey]);
        }
    } 

    render(){
        return(
            <div className = "json-tree-leaf"> 
                <input type="text" className ="json-tree-item-key"
                    value = {this.props.jsonKey}
                    readOnly = "readonly"
                />
                <span className="json-tree-item-col">:</span>
                <input type="text" className ="json-tree-item-val"
                    value = {this.props.jsonVal}
                    onChange = {(e)=>{this.mod(e);}}
                />
                <button type="button" className="json-tree-item-btn json-tree-item-btn-del"
                 onClick={this.del}
                ></button>
                <button type="button" className="json-tree-item-btn json-tree-item-btn-add"
                 onClick={this.addChild}></button>
            </div>
        );
    }
};

class ArrLeaf extends Component{ 

    /* -------------------------
    *  del
    *  -------------------------
    *  @Description: Delete this array leaf node      更改此json数组叶子节点
    *  @Params: 
    *  @Returns: void
    */ 
    del = () =>{ 
        if(this.props.del){
            this.props.del([this.props.jsonKey]);
        }
    } 

    /* -------------------------
    *  addChild
    *  -------------------------
    *  @Description: Add child node in this leaf node      在此json叶子节点增加子节点
    *  @Params: 
    *  @Returns: void
    */
   addChild = () =>{ 
    if(this.props.add){
        this.props.add([this.props.jsonKey]);
    }
}

    /* -------------------------
    *  mod
    *  -------------------------
    *  @Description: Modify value of this array node      更改此json数组叶子节点的值
    *  @Params: 
    *        -  e   <event>   The event object.     触发的事件对象 
    *  @Returns: void
    */
    mod = (e) =>{
        if(this.props.mod){
            this.props.mod(e.target.value,[this.props.jsonKey]);
        }
    }


    render(){ 
        return(
            <div className = "json-tree-leaf">
                <input type="text" className ="json-tree-item-val"
                    value = {this.props.jsonVal}
                    onChange={(e)=>{this.mod(e);}}
                />
                <button type="button" className="json-tree-item-btn json-tree-item-btn-del"
                 onClick={this.del}
                ></button> 

                <button type="button" className="json-tree-item-btn json-tree-item-btn-add"
                 onClick={this.addChild}></button>
            </div>
        );
    }
};

export class JsonNode extends Component{ 
    /* -------------------------
    *  delNode
    *  -------------------------
    *  @Description: Delete this json node      删除此json节点
    *  @Params: 
    *      - nodeChain  <Array[string]>   An chain array indicated the position of this node.  
    *                                     用于定位该节点在json中位置的数组链
    *  @Returns: void
    */
    delNode = (nodeChain) =>{ 
        //add current node to chain  将当前节点添加到链
        nodeChain.splice(0,0,this.props.jsonKey);

        if(this.props.del){ 
            this.props.del(nodeChain);
        }
    }
    
    /* -------------------------
    *  addNode
    *  -------------------------
    *  @Description: Add mew json node      新增json节点
    *  @Params: 
    *      - nodeChain  <Array[string]>   An chain array indicated the position of this node.  
    *                                     用于定位该节点在json中位置的数组链
    *  @Returns: void
    */
    addNode = (nodeChain) =>{ 
        //add current node to chain  将当前节点添加到链
        nodeChain.splice(0,0,this.props.jsonKey);

        if(this.props.add){ 
            this.props.add(nodeChain);
        }
    }

    /* -------------------------
    *  modNode
    *  -------------------------
    *  @Description: Modify value of this json node      修改json节点数值
    *  @Params: 
    *      - val <string>  the value to be changed for this node.  此节点需要更改的值
    *      - nodeChain  <Array[string]>   An chain array indicated the position of this node.  
    *                                     用于定位该节点在json中位置的数组链
    *  @Returns: void
    */
    modNode = (val,nodeChain) =>{ 
        //put current node into chain  将当前节点添加到链
        nodeChain.splice(0,0,this.props.jsonKey);

        if(this.props.mod){ 
            this.props.mod(val,nodeChain);
        }
    }

    /* -------------------------
    *  convertNode
    *  -------------------------
    *  @Description: Convert type of this json node      改变此json节点的类型
    *  @Params:  
    *      - nodeChain  <Array[string]>   An chain array indicated the position of this node.  
    *                                     用于定位该节点在json中位置的数组链
    *  @Returns: void
    */ 
    convertNode = (nodeChain) =>{
        //convert current node to oject  将当前节点转换成对象节点 
        nodeChain.splice(0,0,this.props.jsonKey);
        if(this.props.convert){ 
            this.props.convert(nodeChain);
        }
    }


    /* -------------------------
    *  expandJson
    *  -------------------------
    *  @Description: Traverse and expand of a json object      遍历并展开某个json对象
    *  @Params:  
    *      - json  <Object>    The Json object to be handled.  需要处理的json对象.  
    *  @Returns: void
    */
    expandJson = (json) =>{
        let list = [];

        for(let k in json){ 
            let itm = json[k];

            if(itm instanceof Object){
                //1) Branch node   分支节点
                list.push(<JsonNode key={k} jsonKey = {k} jsonObj = {itm}
                        del={this.delNode} add={this.addNode} mod={this.modNode}
                        convert={this.convertNode}
                    />
                );

            }else{
                //2) Leaf node  末端叶子节点 
                if(json instanceof Array){
                    // Array leaf node  数组叶子节点 
                    list.push(
                        <ArrLeaf key={k} jsonKey = {k} jsonVal = {itm}
                        del={this.delNode} mod={this.modNode} add={this.addNode}/>
                    );
                }else{
                    // Json leaf node    对象叶子节点 
                    list.push(
                        <JsonLeaf key={k} jsonKey = {k} jsonVal = {itm} 
                            del={this.delNode} add={this.addNode} mod={this.modNode}
                        />
                    );
                }
                
            }
        }
        
        return list;
    }


    render(){
        return(
            <div className = "json-tree-node">
                <div className="json-tree-item-head">
                    <input type="text" className ="json-tree-item-key"
                        value = {this.props.jsonKey}
                        readOnly = "readonly"
                    />
                    
                    <button type="button" className="json-tree-item-btn json-tree-item-btn-del"
                     onClick={()=>{this.delNode([])}}
                    ></button>
                    
                    <button type="button" className="json-tree-item-btn json-tree-item-btn-convert"
                     onClick={()=>{this.convertNode([])}}
                     ></button>

                </div>
                {this.expandJson(this.props.jsonObj)}
                <button type="button" className="json-tree-item-btn2 json-tree-item-btn-add"
                    onClick={()=>{this.addNode([])}}
                ></button>
            </div>
        );
    }
};

