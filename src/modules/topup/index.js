//此为列表页
import React from 'react';
import { Table, Pagination, Modal, Input, Radio, Button, DatePicker, Select, Tooltip, Popover } from 'antd';
import { ORIGIN } from '../../constants/index'
//二维码
import QRCode from 'qrcode.react';
import axios from 'axios'
//引入请求接口
import httpAxios from '../../helpers/request';
import './index.css';

import locale from 'antd/es/date-picker/locale/zh_CN';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');



//定义了一个来自React.Component的子类
class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultInfo: [],
            totalAmount: "",
            value: "",
            cardInfo: "",
            showInfo: false
        };
    }

    componentDidMount = () => {
        this.getData();
    }

    //点击搜索
    searchNow() {
        this.getData();
    }

    //请求列表数据
    getData() {
        httpAxios('/tn/tntg/config/CTRL_PAY_CHANNEL', 'post', false, null).then(res => {
            console.log(res);
            if (res.success == true) {
                this.setState({
                    resultInfo: res.resultInfo
                }, () => {
                    this.setState({
                        value: this.state.resultInfo[0].type
                    })
                })
            } else {

            }
        });
    }

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    getCardInfo() {
        httpAxios('/tn/tntg/payCardInfo', 'post', false, null).then(res => {
            this.setState({
                cardInfo: res
            }, () => {
                console.log('我是数据', this.state.cardInfo);
                this.setState({
                    showInfo: true
                })
            })
        });
    }
    payNow() {
        let options = {
            totalAmount: this.state.totalAmount
        }
        httpAxios('/tn/tntg/submitBankTrans/BANK', 'post', false, options).then(res => {
            if (res.success == true) {
                alert("充值已提交，请尽快充值，等待后台审核");
            }
        });
    }
    render() {
        const { resultInfo, value, showInfo, totalAmount, cardInfo } = this.state;
        let infoArray = resultInfo.map(item => {
            if (item.type == 'bank') {
                item.name = '银行卡转账（线下）'
            } else if (item.type == 'alipay') {
                item.name = '支付宝支付（线下）'
            }
            return item;
        })
        let infoDom = infoArray.map(item => (
            <Radio value={item.type} key={item.type}>
                {item.name}
            </Radio>
        ))

        return (
            <div>
                {
                    showInfo == false ? (<div>
                        <div>
                            <div className="title">1.请输入您想要充值的金额</div>
                            <Input className='money' style={{ width: 221 }} placeholder="充值金额" onChange={e => this.setState({ totalAmount: e.target.value })} />
                        </div>
                        <div>
                            <div className="title2">2.充值方式</div>
                            <Radio.Group className='money' onChange={this.onChange} value={value}>
                                {infoDom}
                            </Radio.Group>
                        </div>
                        <div className="sureMoney" onClick={() => this.getCardInfo()}>确认充值</div>
                    </div>) : (
                            <div>
                                {
                                    value == 'bank' ? (<div className="zjbank">
                                        <div className="bigtitle">充值信息确认</div>
                                        <div className="bbox">
                                            <span>收款银行：</span>
                                            <span>{cardInfo.bankName}</span>
                                        </div>
                                        <div className="bbox">
                                            <span>收款人姓名：</span>
                                            <span>{cardInfo.bankAccountName}</span>
                                        </div>
                                        <div className="bbox">
                                            <span>收款账号：</span>
                                            <span>{cardInfo.bankCardNo}</span>
                                        </div>
                                        <div className="bbox">
                                            <span>开户行：</span>
                                            <span>{cardInfo.bankBranch}</span>
                                        </div>
                                        <div className="bbox">
                                            <span>充值金额：</span>
                                            <span>{totalAmount}</span>
                                        </div>
                                        <div className="pay" onClick={() => this.payNow()}>去转账</div>
                                    </div>) : (
                                            <div className="zjbank">
                                                <div className="bigtitle">充值信息确认</div>
                                                <div className="bbox">
                                                    <span>支付宝账号：</span>
                                                    <span>{cardInfo.aliyPay}</span>
                                                </div>
                                                <div className="bbox">
                                                    <span>收款人姓名：</span>
                                                    <span>{cardInfo.aliyPayName}</span>
                                                </div>
                                                <div className="bbox">
                                                    <span>充值金额：</span>
                                                    <span>{totalAmount}</span>
                                                </div>
                                                <div className="bbox">
                                                    <span>支付宝收款码：</span>
                                                    <div className='erimg'>
                                                        <QRCode
                                                            value={'https://' + cardInfo.aliyPayCodeUrl.split('//')[1]}
                                                            size={110}
                                                            fgColor="#000000"
                                                        />
                                                    </div>
                                                </div><br />
                                                <div className="pay">请用支付宝扫码上面的收款码支付</div>
                                            </div>
                                        )
                                }
                            </div>
                        )

                }
            </div>
        );
    }
}

export default EditableTable;