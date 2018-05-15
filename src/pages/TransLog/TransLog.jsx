import React, { Component } from 'react';
import LiteTable from './components/LiteTable';

export default class TransLog extends Component {
  static displayName = 'TransLog';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="trans-log-page">
        <LiteTable />
      </div>
    );
  }
}
