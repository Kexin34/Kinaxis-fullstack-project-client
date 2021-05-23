import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import { connect } from 'react-redux'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Dashboard from '../dashboard/dashboard'
import Category from '../category/category'
import Product from '../product/product'

import Role from '../role/role'
import NotFound from '../404/404'

const { Footer, Sider, Content } = Layout;

// Router management
class Routes extends Component { 
    render() {
        const user = this.props.user
        if(!user || !user._id) {
            return <Redirect to = '/login'/> 
        }
        return (
            <Layout style={{ minHeight:'100%' }}>
              <Sider>
                  <LeftNav/>
              </Sider>
              <Layout>
                <Header/>
                <Content style={{ margin:'20px', backgroundColor:'#fff'}}>
                  <Switch>
                    <Redirect exact={true} from='/' to='/dashboard'/>
                    <Route path='/dashboard' component={ Dashboard }/>
                    <Route path='/category' component={ Category }/>
                    <Route path='/product' component={ Product }/>
                    <Route path='/role' component={ Role }/>
                    
                    <Route component={ NotFound }/>
                  </Switch>
                </Content>
                <Footer style={{textAlign:'right', color:'#ccc'}}>Made by Kexin Wen</Footer>
              </Layout>
            </Layout>
        )
    }
}

export default connect(
  state => ({user: state.user})
)(Routes)
