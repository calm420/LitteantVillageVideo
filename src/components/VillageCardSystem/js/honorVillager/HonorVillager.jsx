import React from 'react';
import {Toast} from 'antd-mobile';

export default class honorVillager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            honorVillagerList:[],
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
            "method": 'getHonorVillager',
            "villageId": this.state.villageId,
        };
        WebServiceUtil.requestLittleAntApi6013(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {
                    if (result.response.length === 0){
                        Toast.info('该村暂无荣誉村民!', 2);
                    }
                    let honorVillagerList = result.response;
                    this.setState({honorVillagerList})
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
                    this.state.honorVillagerList.map((v, i) => {
                        return (
                            <span>
                                <img src={v.avatar}/>
                                <span>{i + 1}</span>
                                <span>{v.userName}</span>
                            </span>
                        );
                    })
                }
            </div>
        )

    }
}