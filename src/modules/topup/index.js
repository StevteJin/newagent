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
            cardInfo: ""
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

            })
        });
    }
    render() {
        const { resultInfo, value } = this.state;
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
            </div>
        );
    }
}

export default EditableTable;