//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';


console.log(httpAxios)
class deposit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goId: "",
            typeList: [{
                id: 0,
                num: 'NO.1',
                date: '日',
                money: '3',
                text: '天天赢',
                class: 'tty',
                amount: 1000
            }],
            nameMsg: "",
            data: [],
            staticData: []
        }
    }
    componentDidMount = () => {
        console.log('接收的', this.props.match.params.id);
        let goId = this.props.match.params.id;
        this.setState({
            goId: goId
        })
    }
    componentWillUnmount = () => {

    }

    back() {
        this.props.history.push('/plan');
    }
    selectType(id, money) {

    }
    finance(){

    }
    financeScheme() {
        let goId = this.props.match.params.id;
        httpAxios('/tn/tntg/financeScheme', 'post', false, null).then(res => {
            const data = {
                id: 0,
                mul: 1
            };
            this.setState({
                staticData: res['resultInfo']
            }, () => {
                if (goId == 0) {
                    this.setState({
                        financeData: this.state.staticData['day'],
                        nameMsg: '按使用金额收取固定收益'
                    })
                } else if (goId == 1) {
                    this.setState({
                        financeData: this.state.staticData['week']
                    })
                } else if (goId == 2) {
                    this.setState({
                        financeData: this.state.staticData['month'],
                        nameMsg: '按申请金额收取固定收益'
                    })
                } else {
                    this.setState({
                        financeData: this.state.staticData['single'],
                        nameMsg: '按个股盈利分成'
                    })
                }
                this.finance();
                // if (this.userInfo.allottedScale === '0') {
                //     this.mulType = this.detail[0].mul;
                // } else {
                //     this.mulType = this.userInfo.financeRatio;
                // }
            })


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
    render() {
        const { typeList, nameMsg } = this.state;
        let typeListDom = typeList.map((item, index) => (
            <div key={index} onClick={() => this.selectType(item.id, item.money)} className="tabsActive">
                <div className="interest">{nameMsg}</div>
                <div className="amount-num">{item.amount}元起</div>
            </div>
        ));
        return (
            <div>
                <div className="navigation">
                    <div className="back" onClick={() => this.back()}></div>
                    <p className="navigation-title">策略</p>
                </div>
                <div className="strategy-tabs">
                    {typeListDom}
                </div>
            </div>
        );
    }
}

export default deposit;