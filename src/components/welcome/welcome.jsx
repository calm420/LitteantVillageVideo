import React from "react";
import './welcome.less';
export default class welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
   
    componentDidMount() {
       
    }


    render() {
        return (
            <div id='welcome'>
                欢迎进入小蚂蚁
            </div>
        )
    }
}