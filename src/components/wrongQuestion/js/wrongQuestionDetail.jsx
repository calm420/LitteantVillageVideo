import React from 'react';
var calm;
export default class wrongQuestionDetail extends React.Component {
    constructor(props){
        super(props);
        calm = this;
        this.state = {
            clientHeight: document.body.clientHeight,
        }
    }

    componentDidMount(){
    }
    render(){
        return(
            <div id="wrongQuestionDetail" style={{ height: calm.state.clientHeight }}>错题本内容</div>
        )
    }
}