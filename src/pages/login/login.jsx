import React from 'react'
import { Form, Input, Button} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { login } from '../../redux/actions'
import { Redirect } from 'react-router-dom';
import logo from '../../assets/imgs/logo.png'
import './login.less'

const Login = (props) => {
  const [form] = Form.useForm();

  const currentUser = props.user
  if (currentUser._id) {
    return <Redirect to = '/dashboard'/>
  }
  
  // Login request
  const onFinish = (values) => {
    const { username, password } = values
    props.login(username, password)
  };

  return (
    <div className="login">
      <header className="login-header">
        <img src={ logo } alt="logo"/>
        <h1>Kinaxis Take-home Project</h1>
      </header>
      <section className="login-content">
        <div className={ currentUser.errorMsg ? 'error-msg show':'error-msg' }>{ currentUser.errorMsg }</div>
        <h4>Login to</h4>
        <h4>E-commerce Back-end platform</h4>
        <Form form={ form } name="normal_login" className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={ onFinish }
        >
          <Form.Item
            name="username"
            rules={[
              {required: true, whitespace: true, message: 'Username required'},
              {min: 4, message: 'Username requires at least 4 characters'},
              {max: 12, message: 'Maximun 12 characters'},
              {pattern: /^[a-zA-Z0-9_]+$/, message: 'Must be letter, numbers or underscores'},
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" style={{ color: 'rgba(0,0,0,.25)' }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Password required' },
              {max: 25, message: 'Password length should no more than 25'},
            ]}
          >
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" style={{ color: 'rgba(0,0,0,.25)' }}/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
};

export default connect(
  state => ({ user: state.user }),
  {login}
)(Login)






