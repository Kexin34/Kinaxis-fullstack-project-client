import React, { Component } from 'react'
import {Card,Select, Input, Button,Table, message} from 'antd'
import {PlusOutlined} from  '@ant-design/icons'
import { queryProducts, querySearchProducts, updateStatus } from '../../request/index'

export default class ProductSummary extends Component {
  state = {
      products: [],     // Product list
      total: 0,         // Product total count
      loading: false, 
      searchWord: '',   // Search keyword
      searchType: 'productName',  // Search based on type (name, desc)
  }

  initColumns = () => {
    this.columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'desc',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        render: (price) => '$' + price
      },
      {
          width: '100px',
          title: 'Status',
          render: (item) => {
            const {status,_id} = item
            return (
              <span>
                  <Button onClick={()=>{this.updateStatus(_id, status === 1 ? 2 : 1)}} 
                  type='primary'>{status === 1 ? 'Remove' : 'Launch'}</Button>
                  <span>{status === 1 ? 'Launched' : 'Removed'}</span>
              </span>
            )
          }
        },
        {
          width: '100px',
          title: 'Opration',
          render: (product) => {
            return (
              <span>
                <Button type="link" onClick={()=>{this.props.history.push('/product/detail', {product} )}}>Detail</Button>
                <Button type="link" onClick={()=>this.props.history.push('/product/addupdate',product)}>Update</Button>
              </span>
            )
          }
        },
    ];
    
  }

  // Load request, may contain search request
  loadProducts = async (pageNum) => {
    this.pageNum = pageNum    
    this.setState({loading: true}) 
    const {searchWord, searchType} = this.state

    let response
    if (searchWord) {
      response = await querySearchProducts({pageNum, pageSize: 5, searchName: searchWord, searchType})
    } else {  
      response = await queryProducts(pageNum, 5)
    }

    this.setState({loading:false})

    // Success, update products list
    if (response.status === 0) {
      const {total, list} = response.data
      this.setState({
        total,
        products: list
      })
    }
  }

  // Update product status 
  updateStatus = async (productId, status) => {
    const response = await updateStatus(productId, status)
    if (response.status === 0) {
      message.success('Update Success')
      this.loadProducts(this.pageNum)  // re-render list
    }
  }

  componentWillMount(){
      this.initColumns()
  }

  componentDidMount() {
    this.loadProducts(1)
  }

  render() {
      const {products, total, loading, searchWord, searchType} = this.state
      const title = (
        <span>
          <Select value={searchType} style={{width: 120}}
            onChange={value => this.setState({searchType: value})}>
            <Select.Option value='productName'>Name</Select.Option>
            <Select.Option value='productDesc'>Description</Select.Option>
          </Select>
          <Input onChange={e => this.setState({searchWord: e.target.value})}
            value={searchWord} placeholder='Keyword' style={{width:150,margin: '0 15px'}}
          />
          <Button onClick={()=>{this.loadProducts(1)}} type='primary'>Search</Button>
        </span>
      )

      const rightButton = (
          <Button 
            onClick={() => this.props.history.push('/product/addupdate')}
            type='primary'>
            <PlusOutlined/>
            Add product
          </Button>
      )
      return (
          <Card title={title} extra={rightButton}>
            <Table 
            loading={loading}
            bordered
            rowKey='_id' 
            dataSource={products}
            columns={this.columns}
            pagination={{
              current: this.pageNum,
              defaultPageSize: 5,
              showQuickJumper: true,
              total,
              onChange: this.loadProducts
            }}/>
          </Card>
      )
  }
}
