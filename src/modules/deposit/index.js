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
            data: []
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

    // generalTrend() {
    //     httpAxios('/tn/tn/quota/generalTrend', 'post', false, null).then(res => {
    //         this.setState({
    //             list: res
    //         })
    //         setTimeout(() => {
    //             this.generalTrend();
    //         }, 60000);
    //     }, error => {
    //         console.log(error.response)
    //         if (error.response.status == 400) {
    //             let data = JSON.stringify(error.response.data.resultInfo);
    //             data = data.replace(/^(\s|")+|(\s|")+$/g, '');
    //             this.setState({
    //                 visible: true,
    //                 msg: data
    //             })
    //         }
    //     });
    // }

    back() {
        this.props.history.push('/plan');
    }
    selectType(id, money) {

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