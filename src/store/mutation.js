import * as types from './mutation-types'
const mutations = {
    [types.SET_SHOP](state, shop) {
      state.shop = shop
    },
}
export default mutations