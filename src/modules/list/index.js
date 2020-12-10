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
      createTimeStart: "",
      createTimeEnd: "",
      data: [],
      dateString: "",
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

    this.getData();
  }

  //点击搜索
  searchNow() {
    this.getData();
  }

  //请求列表数据
  getData() {
    let date = this.getNowFormatDate();
    if (!this.state.createTimeStart) {
      this.setState({
        createTimeStart: date
      }, () => {
        if (!this.state.createTimeEnd) {
          this.setState({
            createTimeEnd: date
          }, () => {
            let username = localStorage.getItem("username");
            let options = {
              accountCode: username,
              createTimeStart: this.state.createTimeStart,
              createTimeEnd: this.state.createTimeEnd
            }
            httpAxios('/tn/tntg/fundStream/list', 'post', false, options).then(res => {
              console.log(res);
              if (res.success == true) {
                this.setState({
                  data: res.resultInfo
                })
              } else {

              }
            });
          })
        }
      })
    } else {
      let username = localStorage.getItem("username");
      let options = {
        accountCode: username,
        type: this.state.type,
        source: this.state.source,
        createTimeStart: this.state.createTimeStart,
        createTimeEnd: this.state.createTimeEnd
      }
      httpAxios('/tn/tntg/fundStream/list', 'post', false, options).then(res => {
        console.log(res);
        if (res.success == true) {
          this.setState({
            data: res.resultInfo
          })
        } else {

        }
      });
    }
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
  //时间改变
  onChangeTime = (value, dateString) => {
    console.log('我是时间', dateString)
    this.setState({
      createTimeStart: dateString[0],
      createTimeEnd: dateString[1]
    })
  }
  onChange1 = (date, dateString) => {
    console.log('开始:', date, dateString);
    this.setState({
      createTimeStart: dateString
    })
  }
  onChange2 = (date, dateString) => {
    console.log('结束', date, dateString);
    this.setState({
      createTimeEnd: dateString
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
    if (who == 'type') {
      this.setState({
        type: value || ""
      })
    } else if (who == 'source') {
      this.setState({
        source: value || ""
      })
    }
  }
  render() {
    const { data, dateString, type, typeList, source, sourceList, createTimeStart, createTimeEnd } = this.state;
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
      title: "充值类型",
      dataIndex: "orderTypeDesc",
      key: "orderTypeDesc",
      align: 'center'
    },
    {
      title: "资金类型",
      dataIndex: "sourceTypeDesc",
      key: "sourceTypeDesc",
      align: 'center'
    },
    {
      title: "资金额度",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: 'center'
    },
    {
      title: "备注",
      dataIndex: "remark",
      key: "remark",
      align: 'center'
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      align: 'center'
    },
    {
      title: "状态",
      dataIndex: "auditResultDesc",
      key: "auditResultDesc",
      align: 'center'
    }];

    return (
      <div>
        <div className="searchBox">
          <div className='inputArray'>
            <label>充值类型 :</label>
            <Select style={{ width: 140 }} className='searchSelect' onChange={(value, event) => { this.handelChangeOther(value, event, 'type') }} allowClear={true}>
              {this.getDom(typeList)}
            </Select>
          </div>
          <div className='inputArray'>
            <label>资金类型 :</label>
            <Select style={{ width: 140 }} className='searchSelect' onChange={(value, event) => { this.handelChangeOther(value, event, 'source') }} allowClear={true}>
              {this.getDom(sourceList)}
            </Select>
          </div>
          <div className='inputArray'>
            <label>开始日期 :</label>
            <DatePicker onChange={this.onChange1} placeholder={createTimeStart} locale={locale} className='dateStyle' />&nbsp;&nbsp;
            <label>结束日期 :</label>
            <DatePicker onChange={this.onChange2} placeholder={createTimeEnd} locale={locale} className='dateStyle' />
            {/* <RangePicker
              onChange={this.onChangeTime}
              locale={locale}
              className='dateStyle'
              placeholder={[dateString, dateString]}
            /> */}
          </div>
          <Button className="searchBtn" type="primary" onClick={() => this.searchNow()}>查询</Button>
        </div>
        <div className="tableBox">
          <Table size="small" columns={columns} dataSource={data} scroll={{ y: 670 }} pagination={false} />
        </div>
      </div>
    );
  }
}

export default EditableTable;