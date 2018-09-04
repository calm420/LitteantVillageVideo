import React from 'react';
var calm;
export default class wrongQuestion extends React.Component {
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
            <div id="wrongQuestion" style={{ height: calm.state.clientHeight }}>错题本</div>
        )
    }
}