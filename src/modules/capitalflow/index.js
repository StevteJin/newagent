//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress, DatePicker } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';
import locale from 'antd/es/date-picker/locale/zh_CN';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

class capitalflow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPc: false,
            createTimeStart: "",
            createTimeEnd: "",
            data: [],
            dateString: "",
            list: []
        }
    }
    componentDidMount = () => {
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
        let date = this.getNowFormatDate();
        this.setState({
            dateString: date
        }, () => {
            this.getlist();
        })

    }
    componentWillUnmount = () => {
        let that = this;
        window.removeEventListener('resize', that.box);
        this.setState = (state, callback) => {
            return;
        };
    }
    box = () => {
        this.browserRedirect();
    }
    getlist() {
        let date = this.getNowFormatDate();
        if (!this.state.createTimeStart) {
            this.setState({
                createTimeStart: date
            }, () => {
                if (!this.state.createTimeEnd) {
                    this.setState({
                        createTimeEnd: date
                    }, () => {
                        let username = localStorage.getItem("username");
                        let options = {
                            accountCode: username,
                            createTimeStart: this.state.createTimeStart,
                            createTimeEnd: this.state.createTimeEnd
                        }
                        httpAxios('/tn/tntg/fundStream/list', 'post', false, options).then(res => {
                            console.log(res);
                            if (res.success == true) {
                                this.setState({
                                    list: res.resultInfo
                                })
                            } else {

                            }
                        });
                    })
                }
            })
        } else {
            let username = localStorage.getItem("username");
            let options = {
                accountCode: username,
                createTimeStart: this.state.createTimeStart,
                createTimeEnd: this.state.createTimeEnd
            }
            httpAxios('/tn/tntg/fundStream/list', 'post', false, options).then(res => {
                console.log(res);
                if (res.success == true) {
                    this.setState({
                        list: res.resultInfo
                    })
                } else {

                }
            });
        }
    }
    getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    handleOk = e => {
        console.log(e);
        if (this.state.msg == '请重新登录') {
            this.props.history.push('/login');
        }
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    browserRedirect() {
        let isPc;
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
            isPc = true
        } else {
            isPc = false
        }
        this.setState({
            isPc: isPc
        })
        console.log('哪一端', isPc);
        return isPc;
    }
    back() {
        this.props.history.push('/usercenter');
    }

    //时间改变
    onChangeTime = (value, dateString) => {
        console.log('我是时间', dateString)
        this.setState({
            createTimeStart: dateString[0],
            createTimeEnd: dateString[1]
        }, () => {
            this.getlist();
        })
    }

    color(status) {
        if (status == 1) {
            return 'status green';
        } else if (status == -1) {
            return 'status';
        } else {
            return 'status blue';
        }
    }

    render() {
        const { isPc, dateString, list } = this.state;
        let listDom = list.map((item, index) => (
            <div className="flow-list" key={index}>
                <div>
                    <p style={{ color: '#F05330' }}>
                        <span>
                            {item.orderTypeDesc}
                        </span>
                        <span style={{ 'marginRight': '10px', color: '#333', 'marginLeft': '20px' }}>
                            {item.sourceTypeDesc}
                        </span>
                        <span className={item.totalAmount >= 0 ? '' : 'blue'}>
                            {item.totalAmount > 0 ? '+' : ''}{item.totalAmount}
                        </span>
                        <span className="status" className={this.color(item.auditResult)}>{item.auditResultDesc}</span>
                    </p>
                    <p>
                        {item.payeeInfo}
                    </p>
                    {item.fundStreamType == 1 ? (<p >
                        备注：{item.remark}
                    </p>) : ""}

                    <p>
                        {item.createTime}
                    </p>
                    {item.auditResult == -1 ? (<p className="red">
                        备注：{item.remark}
                    </p>) : ""}
                </div>
            </div>
        ))
        return (
            <div className="capitalflow">
                <div className="navigation">
                    <div className="back" onClick={() => this.back()}></div>
                    <p className="navigation-title">资金流水</p>
                </div>
                <div className="date-div">
                    <span>查询日期</span>
                    <span className="timedate">
                        <RangePicker
                            onChange={this.onChangeTime}
                            locale={locale}
                            className='dateStyle'
                            placeholder={[dateString, dateString]}
                        />
                    </span>
                </div>
                <div className="flow-content">
                    {listDom}
                </div>
            </div>
        );
    }
}

export default capitalflow;