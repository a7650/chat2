import * as types from './mutation-types'

const mutations={
    [types.SET_USER](state,user){
        state.user = user
    },

    [types.SET_FRIENDS](state,data){
        state.friends = data
    },

    [types.EXIT](state){
        state.user = null
        state.friends = null
        state.current_link = ""
    },

    [types.SET_CURRENTLINK](state,name){
        state.current_link = name
    },

    [types.SET_UNREADNUM](state,data){
        state.unread_num = data
    }

}

export default mutations