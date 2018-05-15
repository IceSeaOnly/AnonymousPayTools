import React, { Component } from 'react';
import ChangePasswordForm from './components/ChangePasswordForm';

export default class AddAccout extends Component {
  static displayName = 'AddAccout';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="add-accout-page">
        <ChangePasswordForm />
      </div>
    );
  }
}
