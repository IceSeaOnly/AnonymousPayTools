/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Grid, Button } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './ChangePasswordForm.scss';
import axios from 'axios';
const { Row, Col } = Grid;

export default class ChangePasswordForm extends Component {
  static displayName = 'ChangePasswordForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      contract:"",
      net:"",
    };
  }

  componentDidMount(){
    var thiz = this;
    axios.get('https://wx.nanayun.cn/api?act=b63b327b67eabba')
    .then((response) => {
        thiz.setState({
          contract:response.data.contract,
          net:response.data.net,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      console.log('values', values);
      if(errors){
        return;
      }
      var crypto = require('crypto');
      var md5Value= crypto.createHash('md5').update(values.address, 'utf8').digest('hex');
      
      window.postMessage({
          "target": "contentscript",
          "data":{
              "to" : this.state.contract,
              "value" : "0",
              "contract" : {
                  "function" : 'occupy',
                  "args" : "[\""+md5Value+"\",\""+values.address+"\",\""+values.nickName+"\"]"
              }
          },
          "method": "neb_sendTransaction"
      }, "*");


    });
  };

  render() {
    return (
      <div className="change-password-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>注册商户</h2>

              <Row wrap style={styles.formItem}>
                <Col xxs="7" s="4" l="3" style={styles.formLabel}>
                  收款地址：
                </Col>
                <Col xxs="16" s="10" l="7">
                  <IceFormBinder
                    name="address"
                    required
                    validator={this.checkPasswd}
                  >
                    <Input
                      size="large"
                    />
                  </IceFormBinder>
                  <IceFormError name="address" />
                </Col>
              </Row>

              <Row wrap style={styles.formItem}>
                <Col xxs="7" s="4" l="3" style={styles.formLabel}>
                  商户昵称：
                </Col>
                <Col xxs="16" s="10" l="7">
                  <IceFormBinder
                    name="nickName"
                    required
                  >
                    <Input
                      size="large"
                    />
                  </IceFormBinder>
                  <IceFormError name="nickName" />
                </Col>
              </Row>
            </div>
          </IceFormBinderWrapper>

          <Row wrap style={{ marginTop: 20 }}>
            <Col xxs={{ offset: 6 }} s={{ offset: 3 }}>
              <Button
                size="large"
                type="primary"
                onClick={this.validateAllFormField}
              >
                提 交
              </Button>
            </Col>
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    marginBottom: 25,
  },
  formLabel: {
    height: '32px',
    lineHeight: '32px',
    textAlign: 'right',
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
