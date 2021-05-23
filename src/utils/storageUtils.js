const USER_KEY = 'user_key'

const storageUtils = {
  getUser(){
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}' )
  },
  saveUser(user) {
    localStorage.setItem(USER_KEY,JSON.stringify(user))
  },
  removeUser(){
    localStorage.removeItem(USER_KEY)
  }
}

export default storageUtils