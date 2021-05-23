import React from 'react'
import {Input, Form} from 'antd'
import Layout from 'antd/lib/layout/layout';

// Create new account
const AddModel = (props) => {
  const [form] = Form.useForm();
  props.setForm(form)
  return (
    <Form form={form}>   
      <Form.Item label='Role name' {...Layout} 
        rules={[{ required: true, message: 'Accout role name is required' }]}
        name='roleName' initialValue=''
      >
        <Input placeholder='Please enter accout role name'/>
      </Form.Item>
    </Form>
  )
}
export default AddModel
