import React, { Component } from 'react';
import "./editor.css";
import {JsonNode} from './JsonTree'

class EditorBox extends Component{
    render(){
        return (
            <div>
                <textarea className = "json-editor-textbox"
                    value = {this.props.initial}
                    onChange ={(e)=>this.props.changeText(e.target.value)}
                >        
                </textarea>
                <div>
                    <button className = "json-editor-button" onClick = {this.props.parseJson}>Go</button>
                </div> 
            </div>
        );
    };
}; 


class EditorTips extends Component{
    render(){
        return(
            <div className = {"json-editor-tips json-editor-tips-"  + this.props.style}>
                {this.props.val}
            </div>
        );
    }
};

class EditKeyDialog extends Component{
    constructor(props){
        super(props);
        this.state={
            keyVal:"", 
            parseTips:"Tips: To veify a valid key.",
            tipsStyle:""
        }
    }
    
    setTips=(tips,style)=>{
        this.setState(state=>{
            state.parseTips = tips;
            state.tipsStyle = style;
            return state;
        });
    } 

    saveKey=(txt)=>{
        this.setState(state=>{  
            state.keyVal=txt; 
            return state;
        })
    }

    /* -------------------------
    *  verifyKey
    *  -------------------------
    *  @Description: Verify the json key is valid or not.       验证json的键值是否合法
    *  @Params: 
    *  @Returns: void
    */
    verifyKey=()=>{

        let parent = this.props.parent;
        let curKey = this.state.keyVal;

        if(curKey.length==0){
            this.setTips("Not allow empty value.","error"); 

        } else if(parent[curKey]==null){
            this.setTips("Valid key \"" + curKey +　"\".","ok"); 
            this.props.confirm(curKey); 
            
        }else{
            //warning:this key already exist 
            this.setTips("\"" + curKey +　"\" already exist in parent object.","error");
        }
    }


    render(){ 
        return(
            <div> 
                <div className="json-editor-dialog-mask"
                    style= {{display: (this.props.show?"block":"none")}}
                > 
                </div>
                <div className="json-editor-dialog-wrap" style= {{display: (this.props.show?"block":"none")}}>
                    <div className="json-editor-dialog-body" >
                        <h4 className="json-editor-dialog-title">Node's Key Name:</h4>
                        <div className="json-editor-dialog-content">
                            <input type="text" className="json-editor-dialog-txt"
                                onChange={(e)=>this.saveKey(e.target.value)}
                            />
                        </div>
                        <div className="json-editor-dialog-content">
                            <input type="button" className="json-editor-dialog-btn json-editor-dialog-btn-ok"
                                onClick={this.verifyKey}
                                value="Confirm"/>
                            <input type="button" className="json-editor-dialog-btn"
                                onClick={this.props.cancel}
                                value="Cancel"/> 
                        </div>
                        <div className="json-editor-dialog-content">
                            <EditorTips val = {this.state.parseTips} style = {this.state.tipsStyle}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


class Editor extends Component{
    constructor(props) {
        super(props);
        this.state = {
            rawVal:"",
            jsonObj: {},
            parseTips:"Tips: Click button \"OK\" to parse the JSON.",
            tipsStyle:"",
            isChkJsonKey:false,
            chkParentJson: {},
            chkFinalKey:""
        } 
    }

    
    changeText =(txt) =>{
        this.setState(state=>{
            state.rawVal = txt;
            return(state);
        }); 
    } 
     

    /* -------------------------
    *  parseJson
    *  -------------------------
    *  @Description: Parse json string into json object    将json字符串解析成json对象
    *  @Params: 
    *  @Returns: void
    */
    parseJson = () => {
        try {
            let json = JSON.parse(this.state.rawVal);
            this.setTips("Parse JSON done!" ,"ok");

            this.setState(state =>{
                state.jsonObj =json;
                state.rawVal = this.formatJson(json);
                return(state);
            });
            

        } catch (error) { 
            this.setTips("Error: "+ error,"error");
        }
        
    }

    /* -------------------------
    *  formatJson
    *  -------------------------
    *  @Description: Format json string    格式化json字符串
    *  @Params:
    *      - json  <string>    A json string to be handled.  待处理的json字符串
    *      - depth <int>       The depth of this json     此json数组的深度
    *  @Returns:
    *      <string> 
    */
    formatJson = (json, depth=0) =>{
        
        let spaceUnit = "    ";
        let spacex1 ="";
        let spacex2 ="";
        for(let i=0; i< depth; i++){
            spacex1 += spaceUnit;
        }
        spacex2 = spacex1 + spaceUnit; 

        let res = "";
        res = "\n" + spacex1 ;
        
        if(json instanceof Array){
            res += "[\n";
        }else{ 
            res += "{\n";
        }
        

        for(let k in json){
            let node = json[k]; 
            if(node instanceof Object){
                //1) Json Object:incursive     Json 对象: 递归调用 
                if(!(node instanceof Array) || !(json instanceof Array)){ 
                    res += spacex2 + "\"" + k + "\":"; 
                }
                res += this.formatJson(node, depth+1);
            }else{
                //2) Terminal Leaf     末端叶子节点
                if(json instanceof Array){ 
                    res += spacex2 + "\"" + node + "\""; 
                }else{
                    res += spacex2 + "\"" + k + "\": \"" + node + "\"";
                } 
            }
            res += ",\n"; 
        }
        res = res.substring(0,res.length-2);
        res += "\n" + spacex1;

        if(json instanceof Array){
            res += "]";
        }else{
            res += "}";
        }

        return res;
    }

    /* -------------------------
    *  setTips
    *  -------------------------
    *  @Description: Parse json string into json object    将json字符串转换成json对象
    *  @Params: 
    *         tips  <string>   The text to be displayed in the tips box .         要在提示框中显示的文本
    *         style <string>   The style of tips box to be set(error,ok,tips).    要设置的提示框风格 
    *  @Returns: void
    */ 
    setTips = (text, style)=>{
        this.setState(state=>{
            state.parseTips = text;
            state.tipsStyle = style;
            return state;
        });
    }


    /* -------------------------
    *  confirmKey
    *  -------------------------
    *  @Description: Pops up a dialog to verify the new key value.     弹出对话框验证新关键值有效性
    *  @Params:
    *      - keyVal  <string>   The key value to be added.  将要新增的键值
    *  @Returns: void
    */ 
    confirmKey=(keyVal)=>{  
        this.setState(state=>{
            //Add a new empty key-val   新增空键值对
            state.chkParentJson[keyVal]= ""; 
            state.isChkJsonKey = false; 
            
            state.rawVal = this.formatJson(state.jsonObj);
            return state;
        }); 
    }

    cancelDialog =()=>{
        //Hide dialog  隐藏对话框
        this.setState(state=>{
            state.isChkJsonKey = false;
            return state;
        });
    }
    

    /* -------------------------
    *  delNode
    *  -------------------------
    *  @Description: Delete one node from json      从json对象中删除某个节点
    *  @Params:
    *      - chain  <Array[string]>   An chain array indicated the position of this node.  
    *                                 用于定位该节点在json中位置的数组链
    *  @Returns: void
    */
    delNode=(chain)=>{ 
        this.setState(state=>{
            //1) Get parent node  获取父节点
            let parent = state.jsonObj;
            for(let i=1;i<chain.length-1;i++){
                parent = parent[chain[i]]; 
            }

            //2) Get child node  获取子节点
            let nodeName = chain[chain.length-1];

            //3) Remove child node from parent node  从父节点中删除子节点
            if(parent instanceof Array){ 
                parent.splice(nodeName,1);
            }else{
                delete parent[nodeName];
            }
            
            state.rawVal = this.formatJson(state.jsonObj);
            return state;
        }) 
    }


    /* -------------------------
    *  addNode
    *  -------------------------
    *  @Description: Add one node from json      向json对象中新增节点
    *  @Params:
    *      - chain  <Array[string]>   An chain array indicated the position of this node.  
    *                                 用于定位该节点在json中位置的数组链
    *  @Returns: void
    */
    addNode=(chain)=>{
        this.setState(state=>{
            if(chain.length===1){
                //root node    根节点
                state.isChkJsonKey = true;
                state.chkParentJson = state.jsonObj; 
            }else{
                //1) Get parent node  获取父节点
                let parent = state.jsonObj; 
                for(let i=1;i<chain.length-1;i++){
                    parent = parent[chain[i]]; 
                }
                //2) Get child node  获取子节点
                let childKey = chain[chain.length-1];
                let childNode = parent[childKey]; 
    
                //3) Add node   新增节点
                if(childNode instanceof Array){
                    // + array node  数组节点
                    childNode.push("");
                }else if(childNode instanceof Object){
                    // + json node   json对象节点
                    // Show dialog to verify input value   弹出对话框验证输入值
                    state.isChkJsonKey = true;
                    state.chkParentJson = childNode;
                }else{
                    // leaf node -> array node     叶子节点 -> 数组节点 
                    parent[childKey] = [childNode,""];  
                }
            }

            //4) Update state  更新状态
            state.rawVal = this.formatJson(state.jsonObj);
            return state;
        })

    }
 
    /* -------------------------
    *  modNode
    *  -------------------------
    *  @Description: Modify one node from json      对json对象中修改某个节点
    *  @Params:
    *      - val    <string>          The expected value to be changed.    将要变更的值
    *      - chain  <Array[string]>   An chain array indicated the position of this node.  
    *                                 用于定位该节点在json中位置的数组链
    *  @Returns: void
    */
    modNode=(val,chain)=>{
        this.setState(state=>{
            //1) Get parent node  获取父节点
            let parent = state.jsonObj;
            for(let i=1;i<chain.length-1;i++){
                parent = parent[chain[i]]; 
            }

            //2) Get child node  获取子节点
            let nodeName = chain[chain.length-1];
            parent[nodeName] = val;

            //3) Update state  更新状态
            state.rawVal = this.formatJson(state.jsonObj);
            return state;
        }) 
    }

    
    /* -------------------------
    *  convertNode
    *  -------------------------
    *  @Description: Convert one node to another typen      将json对象中某个节点转换成不同类型
    *  @Params:
    *      - chain  <Array[string]>   An chain array indicated the position of this node.  
    *                                 用于定位该节点在json中位置的数组链
    *  @Returns: void
    */
    convertNode=(chain)=>{
        this.setState(state=>{
            //1) Get parent node  获取父节点
            let parent = state.jsonObj;
            for(let i=1;i<chain.length-1;i++){
                parent = parent[chain[i]]; 
            }

            //2) Get child node  获取子节点
            let childKey = chain[chain.length-1];
            let childNode = parent[childKey];
            
            if(childNode instanceof Array){
                // Array  >>  Object
                // 数组 转换 对象
                let obj = {};

                for(let i=0; i < childNode.length;i++){
                    obj[childNode[i]] = childNode[i]; 
                } 
                parent[childKey] = obj;

            }else if(childNode instanceof Object){
                // Object  >>  Array
                // 对象 转换 数组
                let arr = []; 
                for(let k in childNode){
                    arr.push(childNode[k]); 
                }
                parent[childKey] = arr;
            } 

            //3) Update state  更新状态
            state.rawVal = this.formatJson(state.jsonObj);
            return state;
        }) 
    }

    render(){ 
        return(
            <div className="page-main">
                <div className="page-col json-editor-box">
                    <h3 className="page-col-title">Input your Json string here:</h3>
                    <EditorBox changeText = {this.changeText} 
                        initial = {this.state.rawVal}
                        parseJson = {this.parseJson}/> 
                    <EditorTips val = {this.state.parseTips} style = {this.state.tipsStyle}/> 
                </div>
                <div className="page-col">
                <h3 className="page-col-title">Parsing result:</h3>
                    <JsonNode jsonKey = "root" jsonObj ={this.state.jsonObj}
                    del={(chain)=>{this.delNode(chain)}}
                    add={(chain)=>{this.addNode(chain)}}
                    mod={(val,chain)=>{this.modNode(val,chain)}}
                    convert={(chain)=>{this.convertNode(chain)}}
                    /> 
                </div>

                 <EditKeyDialog show={this.state.isChkJsonKey}
                    parent={this.state.chkParentJson}
                    confirm={this.confirmKey} 
                    cancel={this.cancelDialog}
                />
            </div>
        );
    }
};

export function JsonEditor(){
    return(
        <Editor/>
    );
}
