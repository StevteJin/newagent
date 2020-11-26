//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';
import banner4 from './img/banner4.png';
import wenhao from './img/wenhao.png';
import right from './img/right.png';

console.log(httpAxios)
class strategy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            goId: "",
            info: {
                bzj: 1000,
                cpje: 5000,
                fwf: '0',
                jjje: 4600,
                tradeDay: "",
                zsje: 4400
            },
            isAdd: "",
            makeFeeRate: "",
            financeFee: "",
            manageFee: "",
            strategyType: "",
            typetype: "",
            separateFeeRate: ""
        }
    }
    componentDidMount = () => {
        let goId = this.props.match.params.id;
        let isAdd = localStorage.getItem("isAdd");
        this.setState({
            goId: goId,
            isAdd: isAdd,
            tradeDay: this.getNowFormatDate()
        });
    }
    componentWillUnmount = () => {

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
    back() {
        this.props.history.push('/deposit/' + this.state.goId);
    }
    alert(num) {

    }
    chicang() {

    }
    submit() {

    }
    render() {
        const { goId, info, isAdd, makeFeeRate, financeFee, manageFee, strategyType, typetype, separateFeeRate } = this.state;
        return (
            <div>
                <div className="navigation">
                    <div className="back" onClick={() => this.back()}></div>
                    <p className="navigation-title">策略</p>
                </div>
                <div>
                    <div className="banner">
                        <p>操盘资金</p>
                        <p>{info.cpje}.00</p>
                        <img src={banner4} alt="" />
                    </div>
                    <div className="content">
                        <div className="cell-list">
                            <div className="list-item">
                                <span className="list-item-name">
                                    {isAdd == 'true' ? "新增" : ""}保证金
                                </span>
                                <span className="list-item-content">
                                    {info.bzj}元
                                </span>
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    建仓费
                                </span>
                                <span className="list-item-content">
                                    {info.fwf}元
                                </span>
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    建仓费率
                                </span>
                                <span className="list-item-content">
                                    {makeFeeRate}
                                </span>
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    管理费率
                                </span>
                                <span className="list-item-content">
                                    {financeFee}
                                </span>
                            </div>
                            {strategyType != 0 ? (
                                <div className="list-item">
                                    <span className="list-item-name">
                                        本{strategyType == 1 ? '周' : '月'}管理费
                                </span>
                                    <span className="list-item-content">
                                        {manageFee}元
                                </span>
                                </div>
                            ) : ""}
                            {typetype == 3 ? (
                                <div className="list-item">
                                    <span className="list-item-name">
                                        分成比例
                                </span>
                                    <span className="list-item-content">
                                        {separateFeeRate}
                                    </span>
                                </div>
                            ) : ""}

                            <div className="list-item" onClick={() => this.alert(0)}>
                                <span className="list-item-name">
                                    警戒线
                                    <img src={wenhao} alt="" />
                                </span>
                                <span className="list-item-content">
                                    {info.jjje}元
                                </span>
                            </div>
                            <div className="list-item" onClick={() => this.alert(1)}>
                                <span className="list-item-name">
                                    平仓线
                                    <img src={wenhao} alt="" />
                                </span>
                                <span className="list-item-content">
                                    {info.zsje}元
                                </span>
                            </div>
                            <div className="list-item">
                                <span className="list-item-name">
                                    开始交易
                                </span>
                                <span className="list-item-content">
                                    {info.tradeDay}
                                </span>
                            </div>
                            <div className="list-item" onClick={() => this.chicang()}>
                                <span className="list-item-name">
                                    持仓限制
                                </span>
                                <img className="right-icon" src={right} alt="" />
                            </div>
                            <div className="list-item">
                                <div className="list-item-content" style={{ color: '#40affe' }}>
                                    {/* <input type="checkbox" name="" id="" [checked]='agreement' [(ngModel)]="agreement" />
                                    <span (click)='attention()'>已阅读并同意《操盘规则》</span> */}
                                </div>
                            </div>
                        </div>
                        <button className='submit' onClick={() => this.submit()}>
                            立即申请
                        </button>
                        <div className="bottombox"></div>
                    </div >
                </div >
            </div >

        );
    }
}

export default strategy;