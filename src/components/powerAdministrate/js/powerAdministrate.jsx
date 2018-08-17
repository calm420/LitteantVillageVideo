import React from 'react';
import {Toast, Modal, ListView, Accordion,Icon} from 'antd-mobile';
import '../css/powerAdministrate.less'

var power_Administrate;
const prompt = Modal.prompt;
const alert = Modal.alert;

export default class powerAdministrate extends React.Component {

    constructor(props) {
        super(props);
        power_Administrate = this;
        this.state = {
            clientHeight: document.body.clientHeight,
            dateArr: [],
            firstKey: ''
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
                    if (!WebServiceUtil.isEmpty(arr)) {
                        _this.setState({dateArr: arr})
                        _this.buildAccordion(arr, flag)
                        // _this.setState({firstKey: arr[0].roleId})
                    }

                } else {
                    Toast.fail(result.msg)
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    buildAccordion = (data, flag) => {
        var _this = this;
        var arr = []
        data.forEach(function (v, i) {
            arr.push(
                <Accordion.Panel header={v.roleName} key={v.roleId + ''}>
                    <ul className="my_flex ul_list_del flex_align_center">
                        <li className="flex_1 user"
                            onClick={power_Administrate.onSelect.bind(this, 'userAdministration', v.roleId)}>
                            <i></i>
                            <div>用户管理</div>
                        </li>
                        <li className="flex_1 permission"
                            onClick={power_Administrate.onSelect.bind(this, 'authorityManagement', v.roleId)}>
                            <i></i>
                            <div>权限管理</div>
                        </li>
                        <li className="flex_1 delete" onClick={power_Administrate.showDelRolePanel.bind(this, v)}>
                            <i></i>
                            <div>删除名称</div>
                        </li>
                        <li className="flex_1 modify" onClick={power_Administrate.showUpdateRolePanel.bind(this, v)}>
                            <i></i>
                            <div>修改名称</div>
                        </li>
                    </ul>
                </Accordion.Panel>
            )

            power_Administrate.setState(
                {accordionArr: arr},
                () => {
                    if (!flag) {
                        power_Administrate.setState({firstKey: String(data[0].roleId)})
                    }
                }
            )
        })
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

    showDelRolePanel = (obj) => {
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
                    var arr = _this.state.dateArr
                    arr.forEach(function (v, i) {
                        if (obj.roleId == v.roleId) {
                            arr.splice(i, 1);
                        }
                    });
                    _this.buildAccordion(arr, true)
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
                    var arr = _this.state.dateArr
                    arr.forEach(function (v, i) {
                        if (obj.roleId == v.roleId) {
                            v.roleName = value;
                        }
                    });
                    _this.buildAccordion(arr, true)
                } else {
                    Toast.fail(result.msg)
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    onSelect = (opt, roleId) => {

        if (opt == 'userAdministration') {
            // 跳转用户管理
            var url = WebServiceUtil.mobileServiceURL + "userAdministration?roleId=" + roleId;
        } else if (opt == 'authorityManagement') {
            // 跳转权限管理
            var url = WebServiceUtil.mobileServiceURL + "accessManagement?roleId=" + roleId;
        }

        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    };

    onChange = (key) => {
        this.setState({firstKey: key})
    }

    render() {
        var _this = this;

        return (
            <div id="powerAdministrate">
                <Accordion accordion className="my-accordion" onChange={this.onChange}
                           activeKey={this.state.firstKey}>
                    {this.state.accordionArr}
                </Accordion>
                <div className="addBtn sameBack" onClick={this.showAddNewRolesPanel}>
                    <span>新增角色<Icon type="plus" /></span>
                </div>
            </div>
        );
    }
}
