import request from './ajax_request'

const BASE = 'https://mysterious-fjord-53168.herokuapp.com'

// Login
export const reqLogin = (username, password) => request(BASE + '/login', {username, password}, 'POST')

/* Categoty API */

// Load main/seb category list
export const queryCategorys = (parentId) => request(BASE + '/manage/category/list', {parentId})
// Load specific category
export const queryCategory = (categoryId) => request(BASE + '/manage/category/info',{categoryId})
// Add category
export const addCategory = (categoryName, parentId) => {request(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')}
// Update category
export const updateCategory = ({categoryId, categoryName}) => request(BASE + '/manage/category/update', {categoryName, categoryId}, 'POST')

/* Product API */

// Load product list base on page
export const queryProducts = (pageNum, pageSize) => request(BASE + '/manage/product/list',{pageNum, pageSize})
// Search product
export const querySearchProducts = ({pageNum, pageSize, searchName, searchType}) => request(BASE+'/manage/product/search', {
  pageNum,pageSize, [searchType]: searchName 
})
// Update product status
export const updateStatus = (productId,status) => request(BASE + '/manage/product/updateStatus',{productId,status},'POST')
// Delete product image
export const deleteImg = (name) => request(BASE + '/manage/img/delete',{name},'POST')
// Add / update single product
export const addOrUpdateProduct = (product) => {
  request(BASE + '/manage/product/' + (product._id ? 'update':'add') ,product,'POST')
}


/* Account role */
// Load all accounts
export const loadRoles = () => request(BASE + '/manage/role/list')
// Update account's role
export const updateRole = (role) => request(BASE+'/manage/role/update',role,'POST')
// Create new account
export const addRole = (roleName) => request(BASE+'/manage/role/add',{roleName},'POST')



//// "proxy": "http://zlx.cool:5000"
// "proxy": "http://localhost:5000"
// "proxy": "http://120.55.193.14:5000"