import React from 'react';
import {Toast, Modal, ListView} from 'antd-mobile';
import '../css/powerAdministrate.less'

var power_Administrate;
const prompt = Modal.prompt;
const alert = Modal.alert;

export default class powerAdministrate extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        power_Administrate = this;
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            defaultPageNo: 1,
            clientHeight: document.body.clientHeight,
        };

    }

    componentWillMount() {
        document.title = "角色管理";   //设置title
    }

    componentDidMount() {
        this.getAllRoles()
    }

    /**
     * 获取所有的角色列表
     */
    getAllRoles(flag) {
        var _this = this;
        const dataBlob = {};

        if (flag) {
            _this.initData = [];
        }

        var param = {
            "method": 'getAllRoles',
            "pageNo": -1,
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

    showAddNewRolesPanel() {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        prompt('请输入角色名称', '', [
            {text: '取消'},
            {text: '确定', onPress: value => power_Administrate.addNewRoles(value)},
        ], 'default', '', [], phone)
        if (phone == 'ios') {
            document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        }
    }

    /**
     * 新增角色
     * @param value
     */
    addNewRoles(value) {

        var param = {
            "method": 'saveOrUpdateRoleInfo',
            "roleJson": JSON.stringify({roleName: value}),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' && result.success == true) {
                    power_Administrate.getAllRoles(true)
                } else {
                    Toast.fail(result.msg)
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    showDelRolePanel(obj) {
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
            {text: '确定', onPress: () => _this.deleteRole(obj)},

        ], phone);
    }

    deleteRole(obj) {
        var _this = this;
        var param = {
            "method": 'deleteRole',
            "roleId": obj.roleId,
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
                        if (obj.roleId == v.roleId) {
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

    showUpdateRolePanel(obj) {
        var phoneType = navigator.userAgent;
        var phone;
        if (phoneType.indexOf('iPhone') > -1 || phoneType.indexOf('iPad') > -1) {
            phone = 'ios'
        } else {
            phone = 'android'
        }
        prompt('请输入角色名称', '', [
            {text: '取消'},
            {text: '确定', onPress: value => power_Administrate.updateRoles(value, obj)},
        ], 'default', '', [], phone)
        if (phone == 'ios') {
            document.getElementsByClassName('am-modal-input')[0].getElementsByTagName('input')[0].focus();
        }
    }

    updateRoles(value, obj) {
        var _this = this;

        var param = {
            "method": 'saveOrUpdateRoleInfo',
            "roleJson": JSON.stringify({roleName: value, roleId: obj.roleId}),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' && result.success == true) {
                    // 刷新
                    Toast.success('重命名成功', 1);
                    _this.state.dataSource = [];
                    _this.state.dataSource = new ListView.DataSource({
                        rowHasChanged: (row1, row2) => row1 !== row2,
                    });
                    _this.initData.forEach(function (v, i) {
                        if (obj.roleId == v.roleId) {
                            v.roleName = value;
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

            return (
                <div>
                    <span>{rowData.roleName}</span>
                    <span onClick={this.showDelRolePanel.bind(this, rowData)}>删除</span>
                    <span onClick={this.showUpdateRolePanel.bind(this, rowData)}>修改</span>
                </div>
            )
        };

        return (
            <div id="powerAdministrate">
                <div style={{height: this.state.clientHeight}}>
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
                        //onEndReached={this.onEndReached}  //当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                        onEndReachedThreshold={10}  //调用onEndReached之前的临界值，单位是像素  number类型
                        initialListSize={30}   //指定在组件刚挂载的时候渲染多少行数据，用这个属性来确保首屏显示合适数量的数据
                        scrollEventThrottle={20}     //控制在滚动过程中，scroll事件被调用的频率
                        style={{
                            height: this.state.clientHeight - 40,
                        }}
                    />
                    <div onClick={this.showAddNewRolesPanel}>新增角色</div>
                </div>
            </div>
        );
    }
}
