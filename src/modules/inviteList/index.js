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
      reallyShow: false,
      fromOne: "",
      toOne: "",
      isEdit: false,
      data: [],
      fromUser: "",
      fromUserName: "",
      selectList: "",
      selectList1: "",
      selectDom: "",
      selectDom1: "",
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
    let options = {
      fromUser: this.state.fromUser,
      fromUserName: this.state.fromUserName,
      pageNo: page,
      pageSize: 16
    }
    httpAxios('/tn/tntg/agent-invite/list', 'post', false, options).then(res => {
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
    })
  }
  getAccountList() {
    let url = '/tn/tntg/agent-invite/edit-pre';
    let method = 'post';
    let beel = false;
    let options = null;
    httpAxios(url, method, beel, options).then(res => {
      console.log('我是数据666', res)
      this.setState({
        selectList: res.data.fromUser,
        selectList1: res.data.toUser
      }, () => {
        let selectDom, selectDom1;
        if (this.state.selectList && this.state.selectList.length > 0) {
          selectDom = this.state.selectList.map((item, index) => (
            <Option value={item.key}>{item.value}</Option>
          ))
          selectDom1 = this.state.selectList1.map((item, index) => (
            <Option value={item.key}>{item.value}</Option>
          ))
        } else {
          selectDom = <Option value=''>无</Option>
          selectDom1 = <Option value=''>无</Option>
        }
        this.setState({
          selectDom: selectDom,
          selectDom1: selectDom1
        })
      })
    })
  }
  addNewNow() {
    this.getAccountList();
    this.setState({
      reallyShow: true,
      fromOne: "",
      toOne: "",
      isEdit: false
    })
  }
  noShowReal() {
    this.setState({
      reallyShow: false
    })
  }
  selectChange(selectedOption) {
    if (!selectedOption) {
      selectedOption = ''
    }
    console.log('没值', selectedOption)
    this.setState({
      fromOne: selectedOption
    }, () => {
      console.log('选择后', this.state.fromOne)
    })
  }
  selectChange1(selectedOption) {
    if (!selectedOption) {
      selectedOption = ''
    }
    this.setState({
      toOne: selectedOption
    })
  }
  addNewPerson() {
    if (this.state.selectList && this.state.selectList.length > 0) {
      if (this.state.fromOne == this.state.toOne) {
        this.setState({
          visible: true,
          msg: '推荐人和客户不能一样'
        }, () => {
          console.log('666', this.state.msg)
        });
      } else {
        let url;

        if (this.state.isEdit == true) {
          url = '/tn/tntg/agent-invite/update';
        } else {
          url = '/tn/tntg/agent-invite/save';
        }
        let method = 'post';
        let beel = false;
        let options = {
          fromUser: this.state.fromOne,
          toUser: this.state.toOne
        };
        httpAxios(url, method, beel, options).then(res => {
          if (res.code === 0) {
            this.setState({
              reallyShow: false,
              visible: true,
              msg: '推荐成功'
            })
            this.searchNow();
          } else {
            this.setState({
              visible: true,
              msg: res.info
            }, () => {
              console.log('666', this.state.msg)
            });
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
        })
      }
    } else {
      this.setState({
        visible: true,
        msg: '没有推荐人和客户，不能提交'
      }, () => {
        console.log('666', this.state.msg)
      });
    }

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
  changeLast(text, record) {
    this.getAccountList();
    console.log('修改', text, record);
    this.setState({
      reallyShow: true,
      fromOne: record.fromUser,
      toOne: record.toUser,
      isEdit: true
    })
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
    const { data, total, dateString, type, typeList, source, sourceList, startTime, endTime, reallyShow, isEdit, selectDom, selectDom1, toOne, fromOne } = this.state;
    //这里数据得自己处理
    let columns = [{
      title: "推荐人ID",
      dataIndex: "fromUser",
      key: "fromUser",
      align: 'center'
    }, {
      title: "推荐人名称",
      dataIndex: "fromUserName",
      key: "fromUserName",
      align: 'center'
    }, {
      title: "客户ID",
      dataIndex: "toUser",
      key: "toUser",
      align: 'center'
    },
    {
      title: "客户名称",
      dataIndex: "toUserName",
      key: "toUserName",
      align: 'center'
    }, {
      title: '操作',
      key: 'operation',
      align: 'center',
      ellipsis: true,
      width: 120,
      dataIndex: 'operation',
      render: (text, record) =>
        <a onClick={() => this.changeLast(text, record)}>修改</a>
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
        {
          reallyShow == true ?
            <div className='bigSelectBox'>
              <div className="selectBox">
                <div className="closeNow" onClick={() => this.noShowReal()}>X</div>
                <div className="tuijian">
                  <label>客户 : </label>
                  <Select style={{ width: 200 }} onChange={(e) => this.selectChange1(e)} defaultValue={toOne} disabled={isEdit == true} allowClear>
                    {selectDom}
                  </Select>
                </div>
                <div className="tuijian">
                  <label>推荐人 : </label>
                  <Select style={{ width: 200 }} onChange={(e) => this.selectChange(e)} defaultValue={fromOne} allowClear>
                    {selectDom1}
                  </Select>
                </div>
                <Button className="addBtn" type="primary" onClick={() => this.addNewPerson()}>确定</Button>
              </div>
            </div> : ''
        }
        <div className="searchBox">
          <div className='inputArray'>
            <label>推荐人ID :</label>
            <Input className='searchSelect' placeholder="推荐人ID" value={this.state.fromUser} onChange={e => this.setState({ fromUser: e.target.value })} />
          </div>
          <div className='inputArray'>
            <label>推荐人名称 :</label>
            <Input className='searchSelect' placeholder="推荐人名称" value={this.state.fromUserName} onChange={e => this.setState({ fromUserName: e.target.value })} />
          </div>
          <Button className="searchBtn" type="primary" onClick={() => this.searchNow()}>查询</Button>
          <Button className="searchBtn" type="primary" onClick={() => this.addNewNow()}>新增</Button>
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