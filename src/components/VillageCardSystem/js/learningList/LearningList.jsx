import React from 'react';
import {Toast} from 'antd-mobile';

export default class learningList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            learningList:[],
        };
    }

    componentWillMount() {
        var locationHref = decodeURI(window.location.href);
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var villageId = locationSearch.split("&")[0].split('=')[1];
        this.setState({villageId});
    }

    componentDidMount(){
        var param = {
            "method": 'getLearningList',
            "villageId": this.state.villageId,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {
                    if (result.response.length === 0){
                        Toast.info('该村暂无学习榜!', 2);
                    }
                    let learningList = result.response;
                    this.setState({learningList});
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    render() {
        return(
            <div>
                {
                    this.state.learningList.map((v, i) => {
                        return (
                            <table>
                                <tr>
                                    <td>{"第"+(i+1)+"名"}</td>
                                    <td>{v.gradeName}</td>
                                    <td>{v.sum}</td>
                                </tr>
                            </table>
                        );
                    })
                }
            </div>
        )

    }
}