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

const { RangePicker } = DatePicker;

//定义了一个来自React.Component的子类
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createTimeStart: "",
      createTimeEnd: "",
      data: []
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
    let options = {
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

  //时间改变
  onChangeTime = (value, dateString) => {
    console.log('我是时间', dateString)
    this.setState({
      createTimeStart: dateString[0],
      createTimeEnd: dateString[1]
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

  render() {
    const { data } = this.state;
    //这里数据得自己处理
    let columns = [{
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
      dataIndex: "payeeInfo",
      key: "payeeInfo",
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
            <label>日期 :</label>
            <RangePicker
              onChange={this.onChangeTime}
              locale={locale}
              className='dateStyle'
            />
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