import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table } from '@icedesign/base';
import axios from 'axios';

export default class LiteTable extends Component {
  static displayName = 'LiteTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      md5:"test",
      isLoading:true,
    };
  }

  componentDidMount(){
    var md5 = this.getQueryString("md5");
    var thiz = this;
    axios.get('https://wx.nanayun.cn/api?act=b63b327b67eabba')
    .then((response) => {
        thiz.setState({
          contract:response.data.contract,
          net:response.data.net,
          md5:md5,
        },function(){thiz.fetchData()});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchData(){
    var thiz = this;
    this.call("listLog","[\""+this.state.md5+"\"]",function(data){
      var ls = JSON.parse(data.result);
      console.log(ls);
      thiz.setState({dataSource:ls,isLoading:false});
    });
  }

  call = (method,args,func)=>{
    var thiz =this;
    axios.post(thiz.state.net+'/v1/user/call', {
          "from": "n1HYFhQwgC2y2StMpTMSkoHbqSKsZEVErFk",
          "to": thiz.state.contract,
          "value": "0",
          "nonce": 0,
          "gasPrice": "1000000",
          "gasLimit": "2000000",
          "contract": {
              "function": method,
              "args": args
          }
      })
      .then(function (response) {
        func(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getQueryString(name){
    var href = window.location.href;
    var idx = href.indexOf(name);
    var len = name.length;
    if(idx == -1) return null;
    return href.substr(idx+len+1);
  }

  renderTime = (timestamp) => {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
  }

  renderPayMuch = (pay)=>{
    return (pay/1000000000000000000).toFixed(2) + " NAS";
  }


  render() {
    return (
      <div className="lite-table">
        <IceContainer >
          <Table dataSource={this.state.dataSource} hasBorder={false} isLoading={this.state.isLoading}>
            <Table.Column title="来自地址" dataIndex="from" />
            <Table.Column title="转账时间" dataIndex="payTime" cell={this.renderTime}/>
            <Table.Column title="转账金额" dataIndex="payMuch" cell={this.renderPayMuch}/>
          </Table>
        </IceContainer>
      </div>
    );
  }
}
