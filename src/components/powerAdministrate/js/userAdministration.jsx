import React from 'react';
import {Toast, ListView, Card, Modal} from 'antd-mobile';
import '../css/userAdministration.less'

var user_Administration;
const alert = Modal.alert;

export default class userAdministration extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        user_Administration = this;
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            clientHeight: document.body.clientHeight,
        };

    }

    componentWillMount() {
        document.title = "权限管理";   //设置title
    }

    componentDidMount() {
        var locationHref = window.location.href;
        var locationSearch = locationHref.substr(locationHref.indexOf("?") + 1);
        var searchArray = locationSearch.split("&");
        var roleId = searchArray[0].split('=')[1];
        this.getAllUsersByRoleId(roleId)
        this.setState({roleId})
    }

    getAllUsersByRoleId(roleId) {
        var _this = this;
        const dataBlob = {};
        var param = {
            "method": 'getAllUsersByRoleId',
            "pageNo": -1,
            "roleId": roleId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' && result.success == true) {
                    var arr = result.response;
                    // var pager = result.pager;
                    for (let i = 0; i < arr.length; i++) {
                        var topic = arr[i];
                        dataBlob[`${i}`] = topic;
                    }
                    var isLoading = false;
                    // if (arr.length > 0) {
                    //     if (pager.pageCount == 1 && pager.rsCount < 30) {
                    //         isLoading = false;
                    //     } else {
                    //         isLoading = true;
                    //     }
                    // } else {
                    //     isLoading = false;
                    // }
                    _this.initData = _this.initData.concat(arr);
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData),
                        isLoadingLeft: isLoading,
                        refreshing: false
                    })
                } else {
                    Toast.fail(result.msg)
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    showAddPower() {
        $('.updateModel').slideDown()
        $('.tagAddPanel_bg').show()
    }

    exitAddTags() {
        $('.updateModel').slideUp()
        $('.tagAddPanel_bg').hide()
    }

    showDeletePower(userRoleId) {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        var _this = this;
        const alertInstance = alert('您确定移除吗?', '', [
            {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
            {text: '确定', onPress: () => _this.deleteUserRole(userRoleId)},

        ], phone);
    }

    deleteUserRole(userRoleId) {
        var _this = this;
        var param = {
            "method": 'deleteUserRole',
            "userRoleId": userRoleId,
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('删除成功', 1);
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (userRoleId == v.userRoleId) {
                            _this.initData.splice(i, 1);
                        }
                    });
                    _this.setState({
                        dataSource: _this.state.dataSource.cloneWithRows(_this.initData)
                    });
                } else {
                    Toast.fail(result.msg)
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    render() {
        var _this = this;

        const row = (rowData, sectionID, rowID) => {
            console.log(rowData);

            return (
                <Card>
                    <div>
                        <img src={rowData.userInfo.avatar} className='avatar'/>
                        <span>{rowData.userInfo.userName}</span>
                        <span onClick={_this.showDeletePower.bind(this, rowData.userRoleId)}>删除</span>
                    </div>
                </Card>
            )
        };

        return (
            <div id="userAdministration">
                <div className='tableDiv' style={{height: user_Administration.state.clientHeight}}>
                    {/*这是列表数据,包括添加按钮*/}
                    <ListView
                        ref={el => this.lv = el}
                        dataSource={this.state.dataSource}    //数据类型是 ListViewDataSource
                        renderFooter={() => (
                            <div style={{paddingTop: 5, paddingBottom: 0, textAlign: 'center'}}>
                                {this.state.isLoadingLeft ? '正在加载' : '已经全部加载完毕'}
                            </div>)}
                        renderRow={row}   //需要的参数包括一行数据等,会返回一个可渲染的组件为这行数据渲染  返回renderable
                        className="am-list"
                        pageSize={30}    //每次事件循环（每帧）渲染的行数
                        //useBodyScroll  //使用 html 的 body 作为滚动容器   bool类型   不应这么写  否则无法下拉刷新
                        scrollRenderAheadDistance={200}   //当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                        onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={{
                            height: user_Administration.state.clientHeight,
                        }}
                    />
                    <div className='addBunton' onClick={this.showAddPower}>
                        <img src={require("../img/addBtn.png")}/>
                    </div>
                </div>

                <div className='updateModel' style={{display: 'none'}}>
                    <div>
                        <div>
                            <input type="text"/>
                            <span>搜索</span>
                        </div>
                    </div>
                    <div className='line_public'></div>
                    <div className="bottomBox">
                        <span className="close" onClick={this.exitAddTags}>取消</span>
                        <span className="bind" onClick={this.addTagsForSure}>确定</span>
                    </div>
                </div>
                <div className="tagAddPanel_bg"></div>
            </div>
        );
    }
}
