import React from 'react';
import { WhiteSpace, SearchBar, Button, WingBlank, Result,Toast } from 'antd-mobile';
import '../css/searchHistory.less';
var calm;
export default class searchHistory extends React.Component {
    constructor(props) {
        super(props);
        calm = this;
        this.state = {
            showCancelButton: false,
            searchHistory: [],
            value:""
        }
    }
    componentWillReceiveProps(){
        window.addEventListener('resize', this.onWindwoResize);
    }
    componentDidMount() {
        document.title = "搜索页面"
        /**
         * 取session数据
         */
        var searchJsonStr = localStorage.getItem('serachArr');
        var searchArray = JSON.parse(searchJsonStr) || [];
        var newSearchArray = []
        for (var i = 0; i < searchArray.length; i++) {
            if (newSearchArray.indexOf(searchArray[i]) == -1) {  //判断在s数组中是否存在，不存在则push到s数组中
                newSearchArray.push(searchArray[i]);
            }
        }
        calm.setState({
            searchHistory: calm.removeEmptyArrayEle(newSearchArray)
        })
        /**
         * 软键盘的搜索事件
         */
        $('.am-search-value').keydown(function (event) {
            if (event.keyCode == 13) {
                // alert('你按下了Enter111');
                calm.serach();
                calm.toSearchResult();

            }
        })

    }
    /**
     * 输入框改变的时候
     */
    onChange = (value) => {
        this.setState({ value });
    };

    /**
     * 数组去重
     */
    dedupe = (array) => {
        return Array.from(new Set(array));
    }
    clear = () => {
        this.setState({ value: '' });
    };
    /**
     * 点击搜索跳转搜索结果页面
     */
    toSearchResult = () => {
        var url = WebServiceUtil.mobileServiceURL + "serachResult?serachValue=" + calm.state.value;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }
    /**
     * 跳转搜索结果页面
     */
    toSearchResultNo = (v) => {
        var url = WebServiceUtil.mobileServiceURL + "serachResult?serachValue=" + v;
        var data = {
            method: 'openNewPage',
            url: url
        };
        Bridge.callHandler(data, null, function (error) {
            window.location.href = url;
        });
    }

    //监听窗口改变时间
    onWindwoResize() {
        // this
        setTimeout(() => {
            calm.setState({
                clientHeight: calm.state.clientHeight,
            })
        }, 100)
    }

    /**
     * 点击搜索
     */
    serach = () => {
        calm.state.searchHistory.push(calm.state.value)
        calm.setState({
            searchHistory: calm.removeEmptyArrayEle(calm.state.searchHistory)
        })
        localStorage.setItem('serachArr', JSON.stringify(calm.state.searchHistory));
    }
    /**
     * 清空session
     */
    clearSession = () => {
        calm.setState({
            searchHistory: []
        })
        localStorage.removeItem("serachArr");
    }

    /**
     * 数组去空
     */
    removeEmptyArrayEle(arr){    
        for(var i = 0; i < arr.length; i++) {
         if(arr[i] == "") {
            arr.splice(i,1);
            i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
                             // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
          }
         }
         return arr;
      };
    render() {
        return (
            <div id='searchHistory'>
                <div className='line_public'>
                    <SearchBar id="search"
                        onSubmit={value => console.log(value, 'onSubmit')}
                        onClear={value => console.log(value, 'onClear')}
                        onFocus={() => console.log('onFocus')}
                        onBlur={() => console.log('onBlur')}
                        onCancel={() => console.log("onCancle")}
                        onChange={this.onChange}
                        showCancelButton={calm.state.showCancelButton}
                        placeholder="请输入搜索内容"
                        maxLength={8} />
                </div>

                <div className='historyCont'>
                    <p className='searchTxt'>历史搜索<span onClick={calm.clearSession}>清空</span></p>
                    {
                        calm.state.searchHistory.map((v, i) => {
                            return (
                                <div className='item' onClick={calm.toSearchResultNo.bind(this, v)}>{v}</div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}