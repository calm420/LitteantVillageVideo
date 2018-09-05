import React from 'react';
var calm;
export default class updateWrongQuestion extends React.Component {
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
            <div id="updateWrongQuestion" style={{ height: calm.state.clientHeight }}>错题本</div>
        )
    }
}