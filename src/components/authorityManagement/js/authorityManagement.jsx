import React from 'react';
import {Toast, ListView, Card, Modal, InputItem, WhiteSpace} from 'antd-mobile';
import '../css/authorityManagement.less'

var authority_Management;
const alert = Modal.alert;

export default class authorityManagement extends React.Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.initData = [];
        authority_Management = this;
        this.state = {
            dataSource: dataSource.cloneWithRows(this.initData),
            clientHeight: document.body.clientHeight,
            powerName: '',
            powerSrc: '',
            powerIcon: '',
            imgFlag: true,
        };

    }

    componentWillMount() {
        document.title = "权限管理";   //设置title
    }

    componentDidMount() {
        this.getAllPowers()
    }

    /**
     * 获取全部的权限列表
     */
    getAllPowers() {
        var _this = this;
        const dataBlob = {};
        _this.initData = [];

        var param = {
            "method": 'getAllPowers',
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

    showDeletePower(id) {
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
            {text: '确定', onPress: () => _this.deletePower(id)},

        ], phone);
    }

    deletePower(id) {
        var _this = this;
        var param = {
            "method": 'deletePower',
            "powerId": id,
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
                        if (id == v.powerId) {
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

    showAddPower() {
        $('.updateModel').slideDown()
        $('.tagAddPanel_bg').show()
    }

    exitAddTags() {
        $('.updateModel').slideUp()
        $('.tagAddPanel_bg').hide()
        authority_Management.setState({powerName: '', powerSrc: '', imgFlag: true, powerIcon: ''})
    }

    addTagsForSure = () => {
        if (WebServiceUtil.isEmpty(this.state.powerName)) {
            Toast.fail('权限名称不能为空');
            return
        }
        if (WebServiceUtil.isEmpty(this.state.powerSrc)) {
            Toast.fail('权限路径不能为空');
            return
        }
        if (WebServiceUtil.isEmpty(this.state.powerIcon)) {
            Toast.fail('权限图标不能为空');
            return
        }

        var _this = this;
        var param = {
            "method": 'saveOrUpdatePower',
            "powerJson": JSON.stringify({
                iconUrl: this.state.powerIcon,
                powerName: this.state.powerName,
                powerUrl: this.state.powerSrc,
            }),
        };

        WebServiceUtil.requestLittleAntApi(JSON.stringify(param), {
            onResponse: result => {
                if (result.msg == '调用成功' && result.success == true) {
                    Toast.success('添加成功', 1);
                    //刷新,下来
                    _this.exitAddTags()
                    _this.getAllPowers()

                } else {
                    Toast.fail(result.msg)
                }

            },
            onError: function (error) {
                Toast.fail(error, 1);
            }
        });
    }

    /**
     * 输入框改变的回调
     * @param type  musicName=歌名  musicMan=歌手
     * @param index
     * @param value
     */
    inputOnChange = (type, value) => {
        if (type == 'powerName') {
            authority_Management.setState({powerName: value})
        } else if (type == 'powerSrc') {
            authority_Management.setState({powerSrc: value})
        }
    }

    uploadImage() {
        var data = {
            method: 'selectImages',
        };
        Bridge.callHandler(data, function (res) {
            // 拿到照片地址,显示在页面等待上传
            let newArr = {};
            let item = res.split("?");
            newArr.picPath = item[0],
                newArr.picName = item[1].split("=")[1]

            authority_Management.state.powerIcon = newArr.picPath
            authority_Management.setState({imgFlag: false})

        }, function (error) {
            console.log(error);
        });
    }

    imgPreview() {

    }

    render() {
        var _this = this;

        const row = (rowData, sectionID, rowID) => {
            console.log(rowData);

            return (
                <Card>
                    <div>
                        <div className="am-list-item"><span>权限名称：</span><span>{rowData.powerName}</span></div>
                        <div className="line_public flex_container"></div>
                        <div className="am-list-item">权限路径：{rowData.powerUrl}</div>
                        <div className="line_public flex_container"></div>
                        <div className="am-list-item">
                            <span>权限图标:</span>
                            <img src={rowData.iconUrl} alt=""/>
                        </div>
                        <div className="line_public flex_container"></div>
                        <span>编辑</span>
                        <span onClick={this.showDeletePower.bind(this, rowData.powerId)}>删除</span>
                    </div>
                </Card>
            )
        };

        return (
            <div id="authorityManagement" style={{height: authority_Management.state.clientHeight}}>
                <div className='tableDiv' style={{height: authority_Management.state.clientHeight}}>
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
                            height: authority_Management.state.clientHeight,
                        }}
                    />
                    <div className='addBunton' onClick={this.showAddPower}>
                        <img src={require("../img/addBtn.png")}/>
                    </div>
                </div>

                <div className='updateModel' style={{display: 'none'}}>
                    <div>
                        <div>
                            <InputItem
                                className="add_element"
                                placeholder="请输入权限名称"
                                value={authority_Management.state.powerName}
                                onChange={authority_Management.inputOnChange.bind(this, 'powerName')}
                            >
                                <div>权限名称</div>
                            </InputItem>
                        </div>
                        <div className="line_public flex_container"></div>
                        <div>
                            <InputItem
                                className="add_element"
                                placeholder="请输入权限路径"
                                value={authority_Management.state.powerSrc}
                                onChange={authority_Management.inputOnChange.bind(this, 'powerSrc')}
                            >
                                <div>权限路径</div>
                            </InputItem>
                        </div>
                        <div className="line_public flex_container"></div>
                        <div className="my_flex sameBack">
                    <span className="textTitle">上传图标
                        <p style={{margin: 0, height: 5}}></p>
                        <span className="uploadSupport">(jpg格式)</span>
                    </span>
                            <div className="upload_file" style={{display: this.state.imgFlag ? 'block' : 'none'}}>
                                <img src={require("../img/addPic.png")} onClick={this.uploadImage}/>
                            </div>
                            <div className="upload_file" style={{display: this.state.imgFlag ? 'none' : 'block'}}>
                                <img onClick={authority_Management.imgPreview.bind(this, this.state.powerIcon)}
                                     className="imgTag" src={this.state.powerIcon}/>
                                <div className="icon_pointer" onClick={authority_Management.uploadImage}>修改</div>
                            </div>

                        </div>
                        <div className="flex_container"></div>
                    </div>
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
