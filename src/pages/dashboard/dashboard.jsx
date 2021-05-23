import React, { Component } from 'react'
import {
    Icon,
    Card,
    Timeline
  } from 'antd'
export default class Dashboard extends Component {
    render() {
        return (
            <div className='dashboard'>
                <Card title='Take home project: Simple e-Commerce management platform' extra={<Icon type="reload"/>} className="home-table-right">
                    <Timeline>
                    <Timeline.Item color="green">Basic module design</Timeline.Item>
                    <Timeline.Item color="green">Backend API implement</Timeline.Item>
                    <Timeline.Item color="red">
                        <p>User Login</p>
                        <p>Category management</p>
                        <p>Product management</p>
                    </Timeline.Item>
                    <Timeline.Item>
                        <p>Account role authorization</p>
                        <p>File upload</p>
                    </Timeline.Item>
                    </Timeline>
                </Card>
            </div>
        )
    }
}
