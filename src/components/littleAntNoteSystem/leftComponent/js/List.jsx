import React from 'react';
import {Tabs,Toast} from 'antd-mobile';
import '../css/List.less'

const tabs = [
    {title: '已发布'},
    {title: '草稿箱'},
];

export default class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsIndex:0,
        };
    }

    componentWillMount() {

    }

    dong(cc) {
       switch (cc){
           case "init":
               this.setState({
                   tabsIndex: 1,
               },()=>{
                   // console.log(this.state.tabsIndex)
                   this.getListData(this.state.tabsIndex);
               });
               break;
       }
    }


    getListData(type){  //0  1
        var param = {
            "method": 'getArticleInfoListByStatus',
            "userId": 1,
            "status": Math.abs(type - 1),
            pageNo:'-1'
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result)
                if (result.success) {

                } else {
                    Toast.fail("chaungjianshibai");
                }
            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    onChange(key, index) {
        console.log(key);
        console.log(index);
    }

    render() {
        return (
            <div id="List">
                <Tabs tabs={tabs}
                      initalPage={0}
                      swipeable={false}
                      animated={false}
                      useOnPan={false}
                      onChange={this.onChange}
                      page={this.state.tabsIndex}
                >
                    <div>1</div>
                    <div>2</div>
                </Tabs>
            </div>
        );
    }
}
