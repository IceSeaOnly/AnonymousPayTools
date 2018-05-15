import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab,Button } from '@icedesign/base';
import axios from 'axios';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';

const TabPane = Tab.TabPane;

const tabs = [
  { tab: '全部', key: 'all' },
];

export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      tabKey: 'all',
      isLoading:true,
    };
    this.columns = [
      {
        title: '商户名',
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: '账户号',
        dataIndex: 'md5',
        key: 'md5',
      },
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog
                index={index}
                record={record}
                getFormValues={this.getFormValues}
              />
              <Button type="secondary" size="small" onClick={()=>this.transLog(record)}>转账记录</Button>
            </span>
          );
        },
      },
    ];
  }

  transLog = (rec)=>{
    var address = rec.md5;
    window.location.href="/#/transLog?md5="+address;
  }

  getQueryString(name){
    var href = window.location.href;
    var idx = href.indexOf(name);
    var len = name.length;
    if(idx == -1) return null;
    return href.substr(idx+len+1);
  }

  componentDidMount(){
    console.log(this.getQueryString("fucked"));

    var thiz = this;
    axios.get('https://wx.nanayun.cn/api?act=b63b327b67eabba')
    .then((response) => {
        thiz.setState({
          contract:response.data.contract,
          net:response.data.net,
        },function(){thiz.fetchData()});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchData() {
    var thiz = this;
    this.call("listAccout","[]",function(data){
      thiz.setState({dataSource:JSON.parse(data.result),isLoading:false})
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


  getFormValues = (dataIndex, values) => {
    var payMuch = values.payMuch;
    window.postMessage({
          "target": "contentscript",
          "data":{
              "to" : this.state.contract,
              "value" : payMuch+"",
              "contract" : {
                  "function" : 'trans',
                  "args" : "[\""+values.md5+"\"]"
              }
          },
          "method": "neb_sendTransaction"
      }, "*");
  };

  handleRemove = (value, index) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey].splice(index, 1);
    this.setState({
      dataSource,
    });
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    
    return (
      <div className="tab-table">
        <IceContainer>
          <Tab onChange={this.handleTabChange} >
            {tabs.map((item) => {
              return (
                <TabPane tab={item.tab} key={item.key} >
                  <CustomTable
                  isLoading={this.state.isLoading}
                    dataSource={this.state.dataSource}
                    columns={this.columns}
                    hasBorder={false}
                  />
                </TabPane>
              );
            })}
          </Tab>
        </IceContainer>
      </div>
    );
  }
}
