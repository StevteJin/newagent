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


console.log(httpAxios)
class login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }
    componentDidMount = () => {
        this.generalTrend();
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

    render() {
        const { list } = this.state;
        let listDom = list.map((item, index) => (
            <div className="tabs-div2 " key={index}>
                <p>{item.preClosePrice}</p>
                <p className={item.upRatio.indexOf('-') >= 0 ? 'green' : 'red'}>{item.lastPrice}</p>
                <p className={item.upRatio.indexOf('-') >= 0 ? 'green' : 'red'}>{item.upRatio}</p>
                <p>{item.stockName}</p>
            </div>
        ))
        return (
            <div>
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
                </div>
            </div>

        );
    }
}

export default login;