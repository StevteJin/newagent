//绑定银行卡，没绑的时候进来，可以写提交，绑了之后，修改银行卡进来仍旧是可以修改的

//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress, DatePicker, Select } from 'antd';
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
const { Option } = Select;
class card extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: "",
            bankId: "",
            provinceId: "",
            cityId: "",
            subBranchId: "",
            cardNo: "",
            userName: "",
            identityNo: "",
            mobile: "",
            bankIdList: [],
            provinceIdList: [],
            cityIdList: [],
            subBranchIdList: [],
            bankName: '',
            provinceName: '',
            cityName: '',
            subBranchName: '',
            id: "",
            accountCode: "",
            accountName: "",
            beginRowNum: "",
            createTime: "",
            order: "",
            pageNo: "",
            pageSize: "",
            paging: "",
            bankShow: false,
            balance: "",
            liftScale: "",
            visible: false,
            msg: "",
            pathpath: ""
        }
    }
    componentDidMount = () => {
        let path = this.props.location.pathname;
        this.setState({
            pathpath: path
        })
        this.browserRedirect();
        let that = this;
        window.addEventListener('resize', that.box);
        this.getBalance();
        this.getCardInfo();
        this.getBankId();
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
    handelChangeOther = (value, event, who) => {
        console.log('数据', value, event, who);
        if (who == 'bankId') {
            this.setState({
                bankId: value,
                bankName: event.children[1]
            }, () => {
                this.getProvinceId();
                this.getcityId();
            })
        } else if (who == 'provinceId') {
            this.setState({
                provinceId: value,
                provinceName: event.children[1]
            }, () => {
                this.getcityId();
                this.setState({
                    cityId: "",
                    subBranchId: ""
                })
            })
        } else if (who == 'cityId') {
            this.setState({
                cityId: value,
                cityName: event.children[1]
            }, () => {
                this.getsubBranchId();
                this.setState({
                    subBranchId: ""
                })
            })
        } else if (who == 'subBranchId') {
            this.setState({
                subBranchId: value,
                subBranchName: event.children[1]
            })
        }
    }
    getCardInfo() {
        let url = '/tn/tn/query/card', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            console.log('数据', res)
            this.getBankId();
            if (res) {
                this.setState({
                    cardInfo: res
                }, () => {
                    console.log('卡数据', this.state.cardInfo);
                    this.setState({
                        id: this.state.cardInfo.id,
                        accountCode: this.state.cardInfo.accountCode,
                        accountName: this.state.cardInfo.accountName,
                        beginRowNum: this.state.cardInfo.beginRowNum,
                        createTime: this.state.cardInfo.createTime,
                        order: this.state.cardInfo.order,
                        pageNo: this.state.cardInfo.pageNo,
                        pageSize: this.state.cardInfo.pageSize,
                        paging: this.state.cardInfo.paging,
                        bankId: String(this.state.cardInfo.bankId),
                        provinceId: String(this.state.cardInfo.provinceId),
                        cityId: String(this.state.cardInfo.cityId),
                        subBranchId: this.state.cardInfo.subBranchId,
                        cardNo: this.state.cardInfo.cardNo,
                        userName: this.state.cardInfo.userName,
                        identityNo: this.state.cardInfo.identityNo,
                        mobile: this.state.cardInfo.mobile,
                        bankName: this.state.cardInfo.bankName,
                        provinceName: this.state.cardInfo.provinceName,
                        cityName: this.state.cardInfo.cityName,
                        subBranchName: this.state.cardInfo.subBranchName,

                    }, () => {
                        this.getProvinceId();
                        this.getcityId();
                        this.getsubBranchId();
                    })
                })
            }

        });
    }
    getBalance() {
        let url = '/tn/tntg/capital', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                balance: res.balance
            });
        }, error => {
            console.log(error.response)
            if (error.response.status == 400) {
                let data = JSON.stringify(error.response.data.resultInfo);
                data = data.replace(/^(\s|")+|(\s|")+$/g, '');
                this.setState({
                    visible: true,
                    msg: data
                })
            }
        });
    }
    getBankId() {
        let url = '/tn/tn/banks', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                bankIdList: res
            })
        });
    }

    getProvinceId() {
        let url = '/tn/tn/banks/' + this.state.bankId + '/provinces', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                provinceIdList: res
            })
        });
    }
    getcityId() {
        if (!this.state.bankId) {
            this.state.bankId = 0
        }
        // if (!this.state.provinceId) {
        //     this.state.provinceId = 0
        // }
        let url = '/tn/tn/banks/' + this.state.bankId + '/province/' + this.state.provinceId + '/cities', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                cityIdList: res
            })
        });
    }

    getsubBranchId() {
        if (!this.state.bankId) {
            this.state.bankId = 0
        }
        if (!this.state.provinceId) {
            this.state.provinceId = 0
        }
        if (!this.state.cityId) {
            this.state.cityId = 0
        }
        let url = '/tn/tn/banks/' + this.state.bankId + '/province/' + this.state.provinceId + '/cities/' + this.state.cityId + '/branches', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                subBranchIdList: res
            })
        });
    }
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
    submite() {
        if (this.state.identityNo.length != 18) {
            this.setState({
                visible: true,
                msg: '请输入正确的身份证号'
            })
        } else {
            let options = {
                accountCode: this.state.accountCode,
                accountName: this.state.accountName,
                bankId: this.state.bankId,
                bankName: this.state.bankName,
                beginRowNum: this.state.beginRowNum,
                cardNo: this.state.cardNo,
                cityId: this.state.cityId,
                cityName: this.state.cityName,
                createTime: this.state.createTime,
                id: this.state.id,
                identityNo: this.state.identityNo,
                mobile: this.state.mobile,
                order: this.state.order,
                pageNo: this.state.pageNo,
                pageSize: this.state.pageSize,
                paging: this.state.paging,
                provinceId: this.state.provinceId,
                provinceName: this.state.provinceName,
                subBranchId: this.state.subBranchId,
                subBranchName: this.state.subBranchName,
                userName: this.state.userName,
            }
            let url = '/tn/tn/bind/card', method = 'post';
            httpAxios(url, method, false, options).then(res => {
                if (res.success == true) {
                    this.setState({
                        visible: true,
                        msg: '银行卡信息修改成功'
                    })
                    this.props.history.push('/tixian');
                }
            }, error => {
                console.log(error.response)
                if (error.response.status == 400) {
                    let data = JSON.stringify(error.response.data.resultInfo);
                    data = data.replace(/^(\s|")+|(\s|")+$/g, '');
                    this.setState({
                        visible: true,
                        msg: data
                    })
                }
            });
        }

    }
    render() {
        const { isPc, cardInfo, bankIdList, provinceIdList, cityIdList, subBranchIdList, bankId, provinceId, cityId, subBranchId, bankName, provinceName, cityName, subBranchName, bankShow, balance, pathpath } = this.state;
        let bankIdDom, provinceIdDom, cityIdDom, subBranchIdDom;
        if (bankIdList && bankIdList.length > 0) {
            bankIdDom = bankIdList.map(item => (
                <Option value={item.value} key={item.value}> {item.text} </Option>
            ))
        }

        if (provinceIdList && provinceIdList.length > 0) {
            provinceIdDom = provinceIdList.map(item => (
                <Option value={item.value} key={item.value}> {item.text} </Option>
            ))
        }

        if (cityIdList && cityIdList.length > 0) {
            cityIdDom = cityIdList.map(item => (
                <Option value={item.value} key={item.value}> {item.text} </Option>
            ))
        }

        if (subBranchIdList && subBranchIdList.length > 0) {
            subBranchIdDom = subBranchIdList.map(item => (
                <Option value={item.value} key={item.value}> {item.text} </Option>
            ))
        }
        return (
            <div>
                <Modal
                    title="提示"
                    centered
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <p>{this.state.msg}</p>
                </Modal>
                <div className="navigation">
                    <div className="back" onClick={() => this.back()}></div>
                    <p className="navigation-title">{cardInfo ? "银行卡信息" : "绑定银行卡"}</p>
                </div>
                <div className='bankbox1'>
                    <div className="bank">
                        <span className="title">开户银行</span>
                        <Select value={bankId} style={{ width: 240 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'bankId') }} disabled={cardInfo && pathpath == '/card/tixian' ? true : false}>
                            {bankIdDom}
                        </Select>
                    </div>
                    <div className="bank">
                        <span className="title">开户银行省份</span>
                        <Select value={provinceId} style={{ width: 240 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'provinceId') }} disabled={cardInfo && pathpath == '/card/tixian' ? true : false}>
                            {provinceIdDom}
                        </Select>
                    </div>
                    <div className="bank">
                        <span className="title">开户银行城市</span>
                        <Select value={cityId} style={{ width: 240 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'cityId') }} disabled={cardInfo && pathpath == '/card/tixian' ? true : false}>
                            {cityIdDom}
                        </Select>
                    </div>
                    <div className="bank">
                        <span className="title">开户银行支行</span>
                        <Select value={subBranchId} style={{ width: 240 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'subBranchId') }} disabled={cardInfo && pathpath == '/card/tixian' ? true : false}>
                            {subBranchIdDom}
                        </Select>
                    </div>
                    <div className="bank">
                        <span className="title">卡号</span>
                        <Input style={{ width: 240 }} placeholder="请输入银行卡号" value={this.state.cardNo} onChange={e => this.setState({ cardNo: e.target.value })} disabled={cardInfo && pathpath == '/card/tixian' ? true : false} />
                    </div>
                    <div className="bank">
                        <span className="title">户名</span>
                        <Input style={{ width: 240 }} placeholder="请输入银行卡户名" value={this.state.userName} onChange={e => this.setState({ userName: e.target.value })} disabled={cardInfo ? true : false} />
                    </div>
                    <div className="bank">
                        <span className="title">身份证</span>
                        <Input style={{ width: 240 }} placeholder="请输入身份证" value={this.state.identityNo} onChange={e => this.setState({ identityNo: e.target.value })} disabled={cardInfo ? true : false} />
                    </div>
                    <div className="bank">
                        <span className="title">会员ID</span>
                        <Input style={{ width: 240 }} placeholder="请输入手机号" value={this.state.mobile} onChange={e => this.setState({ mobile: e.target.value })} disabled={cardInfo ? true : false} />
                    </div>
                    {cardInfo && pathpath == '/card/tixian' ? "" : (
                        <div className="addSubmite1" onClick={() => this.submite()}>完成</div>
                    )}
                </div>
            </div>
        );
    }
}

export default card;