//此为主页
import React from 'react';
//redux
//步骤一
import store from '../../store/store'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';
import { Input } from 'antd';
import { Select } from 'antd';
const { Option } = Select;

class UserCenter extends React.Component {
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
            liftScale: ""
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {
        this.getBalance();
        this.getCardInfo();
        this.getBankId();
    }

    getBalance() {
        let url = '/tn/tntg/capital', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                balance: res.balance
            });
        });
    }
    moneyNow() {
        let options = {
            liftScale: this.state.liftScale
        }
        let url = '/tn/tntg/lift', method = 'post';
        httpAxios(url, method, false, options).then(res => {
            this.getBalance();
        });
    }
    bandCard() {
        this.setState({
            bankShow: true
        })
    }

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
            })
        } else if (who == 'cityId') {
            this.setState({
                cityId: value,
                cityName: event.children[1]
            }, () => {
                this.getsubBranchId();
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
                    this.getBankId();
                    this.getProvinceId();
                    this.getcityId();
                    this.getsubBranchId();
                })
            })
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
        if (!this.state.provinceId) {
            this.state.provinceId = 0
        }
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

    submite() {
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
                    bankShow: false
                })
            }
        });
    }


    render() {
        const { cardInfo, bankIdList, provinceIdList, cityIdList, subBranchIdList, bankId, provinceId, cityId, subBranchId, bankName, provinceName, cityName, subBranchName, bankShow, balance } = this.state;
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
                {bankShow == true ? (<div className='bankbox'>
                    <div className="bank">
                        <span className="title">开户银行</span>
                        <Select value={bankId} style={{ width: 300 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'bankId') }} allowClear={true}>
                            {bankIdDom}
                        </Select>
                    </div>
                    <div className="bank">
                        <span className="title">开户银行省份</span>
                        <Select value={provinceId} style={{ width: 300 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'provinceId') }}>
                            {provinceIdDom}
                        </Select>
                    </div>
                    <div className="bank">
                        <span className="title">开户银行城市</span>
                        <Select value={cityId} style={{ width: 300 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'cityId') }}>
                            {cityIdDom}
                        </Select>
                    </div>
                    <div className="bank">
                        <span className="title">开户银行支行</span>
                        <Select value={subBranchId} style={{ width: 300 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'subBranchId') }}>
                            {subBranchIdDom}
                        </Select>
                    </div>
                    <div className="bank">
                        <span className="title">卡号</span>
                        <Input style={{ width: 300 }} placeholder="请输入银行卡号" value={this.state.cardNo} onChange={e => this.setState({ cardNo: e.target.value })} />
                    </div>
                    <div className="bank">
                        <span className="title">户名</span>
                        <Input style={{ width: 300 }} placeholder="请输入银行卡户名" value={this.state.userName} onChange={e => this.setState({ userName: e.target.value })} />
                    </div>
                    <div className="bank">
                        <span className="title">身份证</span>
                        <Input style={{ width: 300 }} placeholder="请输入身份证" value={this.state.identityNo} onChange={e => this.setState({ identityNo: e.target.value })} />
                    </div>
                    <div className="bank">
                        <span className="title">会员ID</span>
                        <Input style={{ width: 300 }} placeholder="请输入手机号" value={this.state.mobile} onChange={e => this.setState({ mobile: e.target.value })} />
                    </div>
                    <div className="addSubmite" onClick={() => this.submite()}>完成</div>
                </div>) : (
                        <div className="tbox">
                            <div className="tb1">
                                <div className="tt1">可提现金额：</div>
                                <div className="tt2">{balance}</div>
                            </div>
                            <div className="tb2" onClick={() => this.bandCard()}>绑定提现银行卡</div>
                            <div className="tb3">
                                <div className="ttb3">
                                    <div className="tt1">请输入您想要提现的金额:</div>
                                    <Input style={{ width: 221 }} placeholder="请输入提现金额" onChange={e => this.setState({ liftScale: e.target.value })} />
                                </div>
                                <div className="moneyNow" onClick={() => this.moneyNow()}>申请提现</div>
                            </div>
                        </div>)}
            </div>
        );
    }
}

export default UserCenter;