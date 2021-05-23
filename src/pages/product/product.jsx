import React from 'react'
import { Route, Switch, Redirect} from 'react-router-dom'
import ProductSummary from './product-summary'
import ProductAddUpdate from './addupdateModel/add-update'
import ProductDetail from './product-detail'
import './product.less'
 
// Product Routes
const Product = (props) => {
    return (
        <Switch>
            <Route path='/product' component={ProductSummary} exact/>
            <Route path='/product/addupdate' component={ProductAddUpdate} />
            <Route path='/product/detail' component={ProductDetail} />
            <Redirect to='/product' />
        </Switch>
    )
}
export default Product;
