//此为列表页
import React from 'react';
import { Input, Button, Modal, Progress } from 'antd';
//antd样式
import 'antd/dist/antd.css';
//公共样式
import './index.css';
//引入请求接口
import httpAxios from '../../helpers/request';
import indexbanner3 from './img/indexbanner3.png';
import huo from './img/huo.png';
import banner1 from './img/banner1.png';
import btn1 from './img/btn1.png';

console.log(httpAxios)
class mIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            title: [{
                id: 0,
                text: '按日结算'
            }, {
                id: 2,
                text: '按月结算'
            }, {
                id: 3,
                text: '单票方案'
            }],
            detail: [{
                img: './img/banner1.png',
                btn: './img/btn1.png',
                id: 0,
                num: 'NO.1',
                amount: '1000元起',
                multiple: '8',
                date: '日',
                money: '3',
                money2: '元',
                text: '2个交易日',
                style: 'span1',
                btns: 'btn1',
                text1: '按日结算',
                zhongText: '按使用金额收取固定收益',
                //美林顾客
                diText: '1000元起',
                //赢顾客
                // diText: '无资金限制'
            }, {
                img: './img/banner1.png',
                btn: './img/btn1.png',
                id: 2,
                num: 'NO.2',
                amount: '1000元起',
                multiple: '8',
                date: '月',
                money: '3',
                money2: '元',
                text: '2个交易日',
                style: 'span1',
                btns: 'btn1',
                text1: '按月结算',
                zhongText: '按申请金额收取固定收益',
                diText: '1000元起'
            }, {
                img: './assets/images/banner1.png',
                btn: './assets/images/btn1.png',
                id: 3,
                num: 'NO.3',
                amount: '1000元起',
                multiple: '8',
                date: '单票',
                money: '3',
                money2: '元',
                text: '2个交易日',
                style: 'span1',
                btns: 'btn1',
                text1: '合作分成',
                //美林客户
                zhongText: '免息盈利分成',
                //赢客户
                // zhongText: '按个股盈利分成',
                //美林顾客
                diText: '1000元起',
                //赢顾客
                // diText: '无资金限制'
            }],
            addId: 0,
            newslist: []
        }
    }
    componentDidMount = () => {
        this.generalTrend();
        this.newsList();
    }
    componentWillUnmount = () => {

    }

    generalTrend() {
        httpAxios('/tn/tn/quota/generalTrend', 'post', false, null).then(res => {
            this.setState({
                list: res
            })
            setTimeout(() => {
                this.generalTrend();
            }, 60000);
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

    color(string) {
        if (string) {
            if (string.indexOf('-') >= 0) {
                return 'green';
            } else {
                return 'red';
            }
        }
    }

    changeId(id) {
        this.setState({
            addId: id
        })
    }
    goto(id) {

    }
    goto2(id) {

    }

    newsList() {
        httpAxios('/tn/tn/quota/newsList', 'post', false, null).then(res => {
            this.setState({
                newslist: res
            })
            setTimeout(() => {
                this.generalTrend();
            }, 60000);
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
        const { list, title, detail, newslist } = this.state;
        let listDom = list.map((item, index) => (
            <div className="tabs-div2 " key={index}>
                <p>{item.preClosePrice}</p>
                <p className={item.upRatio.indexOf('-') >= 0 ? 'green' : 'red'}>{item.lastPrice}</p>
                <p className={item.upRatio.indexOf('-') >= 0 ? 'green' : 'red'}>{item.upRatio}</p>
                <p>{item.stockName}</p>
            </div>
        ))
        let titleDom = title.map((item, index) => (
            <div key={index} className="addTabs" onClick={() => this.changeId(item.id)}>
                <span className={this.state.addId == item.id ? 'addIdStyle' : ''}>{item.text}</span>
            </div>
        ))

        let detailDom = detail.map((item, index) => (
            <div key={index}>
                <div className={this.state.addId == item.id ? "zixun-box" : "zixun-box disnone"}>
                    <img className="bgbanner" src={banner1} alt="" />
                    <div className="zixun-num">{item.money}</div>
                    <div className="zixun-content1">
                        <div className="zixun1">{item.zhongText}</div>
                        <div className="zixun2">{item.diText}</div>
                        <div className={item.btns} onClick={() => this.goto(item.id)}>
                            立即申请
                    </div>
                    </div>
                </div>
            </div>
        ))

        let newsListDom = newslist.map((item, index) => (
            <div className="news-content" key={index} onClick={() => this.goto2(item.id)}>
                <p className="content-title">
                    {item.title}
                </p>
                <p className="content-info">
                    <span>
                        {item.createTime}
                    </span>
                </p>
            </div>
        ))
        return (
            <div className="mIndex">
                <div className="navigation">
                    <p className="navigation-title">首页</p>
                </div>
                <div className="index-page">
                    <div className="topbanner">
                        <img src={indexbanner3} alt="" />
                    </div>
                    <div className="tabs">
                        {listDom}
                    </div>
                    <div className="new-zixun">
                        <div className="addTabsBox">
                            {titleDom}
                        </div>
                        {detailDom}
                    </div>
                    <div className="news">
                        <div className="news-title">
                            <img src={huo} alt="" />
                            <span>重磅资讯：</span>
                        </div>
                        <div className="newsbox">
                            <div id="scrollBox">
                                {newsListDom}
                            </div>
                        </div>
                    </div>
                    <div className="bottombox"></div>
                </div>
            </div>

        );
    }
}

export default mIndex;