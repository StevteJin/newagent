//此为列表页
import React from 'react';
import { Table, Pagination, Modal, Input, Button, DatePicker, Select, Tooltip, Popover } from 'antd';

import { ORIGIN } from '../../constants/index'
//二维码
import QRCode from 'qrcode.react';
import axios from 'axios'
//引入请求接口
import httpAxios from '../../helpers/request';
import erimg from './img/ercode.png';
import './index.css';

import locale from 'antd/es/date-picker/locale/zh_CN';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
//定义了一个来自React.Component的子类
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountCode: "",
      accountName: "",
      startTime: "",
      endTime: "",
      current: 1,
      data: [],
      dateString: "",
      total: "",
      type: "",
      typeList: [
        { key: "", value: "所有" },
        { key: 1, value: "充值" },
        { key: 2, value: "提现" },
        { key: 3, value: "资金调整" },
        { key: 4, value: "入金" },
        { key: 5, value: "出金" },
        { key: 6, value: "管理费" },
        { key: 7, value: "佣金转入" },
        { key: 8, value: "补平亏损" },
        { key: 9, value: "委托成交" },
        { key: 10, value: "除息分红" },
        { key: 11, value: "除权除息税费" },
        { key: 12, value: "单票免息" }
      ],
      source: "",
      sourceList: [
        { key: "", value: "所有" },
        { key: 1, value: "账户余额" },
        { key: 2, value: "可用资金" }
      ]
    };
  }

  componentDidMount = () => {
    let date = this.getNowFormatDate();
    this.setState({
      dateString: date
    }, () => {
    })

    this.getData(1);
  }

  //点击搜索
  searchNow() {
    this.getData(1);
  }

  //请求列表数据
  getData(page) {
    let date = this.getNowFormatDate();
    if (!this.state.startTime) {
      this.setState({
        startTime: date
      }, () => {
        if (!this.state.endTime) {
          this.setState({
            endTime: date
          }, () => {
            let options = {
              accountCode: this.state.accountCode,
              accountName: this.state.accountName,
              startTime: this.state.startTime,
              endTime: this.state.endTime,
              pageNo: page,
              pageSize: 16
            }
            httpAxios('/tn/tntg/agent-invite/funds-list', 'post', false, options).then(res => {
              console.log('我是数据1', res);
              if (res.code == 200) {
                this.setState({
                  data: res.data.rows,
                  total: res.data.total
                })
              } else {

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
          })
        }
      })
    } else {
      let options = {
        accountCode: this.state.accountCode,
        accountName: this.state.accountName,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        pageNo: page,
        pageSize: 16
      }
      httpAxios('/tn/tntg/agent-invite/funds-list', 'post', false, options).then(res => {
        console.log('我是数据2', res, typeof (res.data.rows), res.data.rows);
        if (res.code == 200) {
          this.setState({
            data: res.data.rows,
            total: res.data.total
          })
        } else {

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
  exportExcel() {
    let options = {
      accountCode: this.state.accountCode,
      accountName: this.state.accountName,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      pageNo: this.state.current,
      pageSize: 16
    }
    axios({ // 用axios发送post请求
      method: 'post',
      url: `${ORIGIN}` + '/tn/tntg/agent-invite/funds-list/export', // 请求地址
      data: options, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    })
      .then((res) => { // 处理返回的文件流
        const excelName = '会员直推统计.xls';
        const content = res;
        const blob = new Blob([content])
        const fileName = excelName
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
  }
  //分页改变
  onChange = page => {
    console.log(page);
    this.setState({
      current: page,
    }, () => {
      this.getData(this.state.current);
    });
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
  //时间改变
  onChangeTime = (value, dateString) => {
    console.log('我是时间', dateString)
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1]
    })
  }
  onChange1 = (date, dateString) => {
    console.log('开始:', date, dateString);
    this.setState({
      startTime: dateString
    })
  }
  onChange2 = (date, dateString) => {
    console.log('结束', date, dateString);
    this.setState({
      endTime: dateString
    })
  }
  //数组去重
  deteleObject(obj) {
    let uniques = [];
    let stringify = {};
    for (let i = 0; i < obj.length; i++) {
      let keys = Object.keys(obj[i]);
      keys.sort(function (a, b) {
        return (Number(a) - Number(b));
      });
      let str = '';
      for (let j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }
    uniques = uniques;
    return uniques;
  }
  //用来获取下拉选项
  getDom(list) {
    const mainArray = list;
    return mainArray.map((item1, key1) => (
      <Option value={item1.key}> {item1.value} </Option>
    ))
  }

  handelChangeOther = (value, event, who) => {
    console.log('我是值', value, event, who);
    if (who == 'accountCode') {
      this.setState({
        accountCode: value || ""
      })
    } else if (who == 'accountName') {
      this.setState({
        accountName: value || ""
      })
    }
  }
  render() {
    const { data, total, dateString, type, typeList, source, sourceList, startTime, endTime } = this.state;
    //这里数据得自己处理
    let columns = [{
      title: "会员ID",
      dataIndex: "accountCode",
      key: "accountCode",
      align: 'center'
    }, {
      title: "会员名称",
      dataIndex: "accountName",
      key: "accountName",
      align: 'center'
    }, {
      title: "直推会员数",
      dataIndex: "inviteCount",
      key: "inviteCount",
      align: 'center'
    },
    {
      title: "成交数量",
      dataIndex: "totalDealCnt",
      key: "totalDealCnt",
      align: 'center'
    },
    {
      title: "总成交金额",
      dataIndex: "totalDealAmount",
      key: "totalDealAmount",
      align: 'center'
    },
    {
      title: "交易佣金汇总",
      dataIndex: "totalCommissionRebate",
      key: "totalCommissionRebate",
      align: 'center'
    },
    {
      title: "管理费汇总",
      dataIndex: "totalManagerRebate",
      key: "totalManagerRebate",
      align: 'center'
    },
    {
      title: "利润分成汇总",
      dataIndex: "totalProfitRebate",
      key: "totalProfitRebate",
      align: 'center'
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: 'center'
    }];

    return (
      <div>
        <Modal
          title="提示"
          centered
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[<Button key="submit" type="primary" onClick={this.handleOk}>确定</Button>]}>
          <p>{this.state.msg}</p>
        </Modal>
        <div className="searchBox">
          <div className='inputArray'>
            <label>会员ID :</label>
            <Input className='searchSelect' placeholder="会员ID" value={this.state.accountCode} onChange={e => this.setState({ accountCode: e.target.value })} />
          </div>
          <div className='inputArray'>
            <label>会员名称 :</label>
            <Input className='searchSelect' placeholder="会员名称" value={this.state.accountName} onChange={e => this.setState({ accountName: e.target.value })} />
          </div>
          <div className='inputArray'>
            <label>开始日期 :</label>
            <DatePicker onChange={this.onChange1} placeholder={startTime} locale={locale} className='dateStyle' />&nbsp;&nbsp;
            <label>结束日期 :</label>
            <DatePicker onChange={this.onChange2} placeholder={endTime} locale={locale} className='dateStyle' />
          </div>
          <Button className="searchBtn" type="primary" onClick={() => this.searchNow()}>查询</Button>
          <Button className="searchBtn" type="primary" onClick={() => this.exportExcel()}>导出</Button>
        </div>
        <div className="tableBox">
          <Table size="small" columns={columns} dataSource={data} scroll={{ y: 670 }} pagination={false} />
          <div className="pagen">
            <Pagination size="small" current={this.state.current} defaultPageSize={16} onChange={this.onChange} total={total} />
          </div>
        </div>
      </div>
    );
  }
}

export default EditableTable;