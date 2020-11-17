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
        };
    }
    //请求表格数据的操作
    componentDidMount = () => {
        this.getCardInfo();
        this.getBankId();
    }

    handelChangeOther = (value, event, who) => {

    }

    getCardInfo() {
        let url = '/tn/tntg/payCardInfo', method = 'post', options = null;
        httpAxios(url, method, false, options).then(res => {
            this.setState({
                cardInfo: res
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

    render() {
        const { cardInfo, bankIdList } = this.state;

        let bankIdDom = bankIdList.map(item => (
            <Option value={item.value}> {item.text} </Option>
        ))

        return (
            <div className='bankbox'>
                <div className="bank">
                    <span className="title">开户银行</span>
                    <Select style={{ width: 300 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'bankId') }} allowClear={true}>
                        {bankIdDom}
                    </Select>
                </div>
                <div className="bank">
                    <span className="title">开户银行省份</span>
                    <Select style={{ width: 300 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'provinceId') }}>
                        <Option value="lucy">Lucy</Option>
                    </Select>
                </div>
                <div className="bank">
                    <span className="title">开户银行城市</span>
                    <Select style={{ width: 300 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'cityId') }}>
                        <Option value="lucy">Lucy</Option>
                    </Select>
                </div>
                <div className="bank">
                    <span className="title">开户银行支行</span>
                    <Select style={{ width: 300 }} onChange={(value, event) => { this.handelChangeOther(value, event, 'subBranchId') }}>
                        <Option value="lucy">Lucy</Option>
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
                <div className="addSubmite">完成</div>
            </div>
        );
    }
}

export default UserCenter;