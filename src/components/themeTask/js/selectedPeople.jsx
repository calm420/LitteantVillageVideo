import React from 'react';
import {
    Toast, ImagePicker, DatePicker, ListView, Button, Checkbox, List, Radio, Tabs
} from 'antd-mobile';
import '../css/selectedPeople.less';

const CheckboxItem = Checkbox.CheckboxItem;
const RadioItem = Radio.RadioItem;
var dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
});
var that;
export default class articleList extends React.Component {

    constructor(props) {
        super(props);
        that = this;
        this.initDataSource = [];
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initDataSource),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
            radioValue: 0,
            peopleList:[]
        }
    }

    componentDidMount() {
        document.title = '谁可以看';
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var uid = locationSearch.split("&")[0].split("=")[1];
        this.setState({
            userId: uid
        }, () => {
            console.log(uid, 'uid');
            this.getUserFans();
        })

    }


    /**
     * 根据用户ｉｄ获取粉丝列表
     * **/
    getUserFans() {
        var param = {
            "method": 'getUserFans',
            "userId": this.state.userId,
            "targetType": 0,
            "pageNo": this.state.defaultPageNo,
        };
        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                console.log(result, '粉丝列表')

                if (result.success) {
                    this.initDataSource = this.initDataSource.concat(result.response);
                    this.setState({
                        dataSource: dataSource.cloneWithRows(this.initDataSource),
                        isLoading: true,
                        refreshing: false,
                    })
                    if (this.initDataSource.length >= result.pager.rsCount) {
                        this.setState({
                            hasMore: false,
                            isLoading: false
                        })
                    }
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    onChangeCheck = (val) => {
        console.log(val);
        var list = this.state.peopleList;

        if(list.indexOf(val) == -1){
            list.push(val);
        }else{
            list.splice(list.indexOf(val),1);
        }
        console.log(list,'完成后');
        this.setState({
            peopleList:list,
        })
    }

    onChangeRadio = (value) => {
        that.setState({
            radioValue: value
        })
    }

    /**
     *  ListView数据全部渲染完毕的回调
     */
    onEndReached = (event) => {
        var _this = this;
        var currentPageNo = this.state.defaultPageNo;
        if (!this.state.isLoading && !this.state.hasMore) {
            return;
        }
        currentPageNo += 1;
        this.setState({
            isLoading: true,
            defaultPageNo: currentPageNo,
        }, () => {
            this.getUserFans();
        });
    };

    render() {
        const data = [
            {value: 0, label: 'Ph.D.'},
            {value: 1, label: 'Bachelor'},
            {value: 2, label: 'College diploma'},
        ];
        const data1 = [
            {value: 0, label: '全部可见'},
            {value: 1, label: '部分可见'},
        ];
        const {radioValue} = this.state;
        const row = (rowData, sectionID, rowID) => {
            return (
                <CheckboxItem key={rowData.fansUser.uid} onChange={() => this.onChangeCheck(rowData.fansUser.uid)}>
                    {rowData.fansUser.userName}
                </CheckboxItem>
            )
        };
        return (
            <div id="selectedPeople" style={{height: document.body.clientHeight}}>

                <List>
                    {data1.map(i => (
                        <RadioItem key={i.value} checked={radioValue === i.value}
                                   onChange={() => this.onChangeRadio(i.value)}>
                            {i.label}
                        </RadioItem>
                    ))}
                </List>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                    renderFooter={() => (
                        <div style={{paddingTop: 5, paddingBottom: 46, textAlign: 'center'}}>
                            {this.state.isLoading ? '正在加载...' : '已经全部加载完毕'}
                        </div>)}
                    renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                    className="am-list"
                    pageSize={30}    //每次事件循环（每帧）渲染的行数
                    //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                    scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                    onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用+39*
                    onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                    initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                    scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                    style={
                        this.state.radioValue ? {display: 'block', height: this.state.clientHeight} : {
                            display: 'none',
                            height: this.state.clientHeight
                        }
                    }
                />
            </div>
        );
    }

}