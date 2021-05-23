import React, { Component } from 'react'
import { Row, Col, Button } from 'antd'

export default class NotFound extends Component {
    goHome = () => {
      this.props.history.replace('/home')
    }
    render() {
        return (
          <Row className='not-found'>
            <Col span={12} className='left'></Col>
            <Col span={12} className='right'>
              <h1>404</h1>
              <h2>Sorry, the request page is not find</h2>
              <div>
                <Button type='primary' onClick={this.goHome}>
                  Back to dashboard
                </Button>
              </div>
            </Col>
          </Row>
        )
    }
}


