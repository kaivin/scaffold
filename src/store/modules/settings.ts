import { Module } from 'vuex'
import { setType } from "#/store";
import { getConfig } from "@/config";

const settingsModule: Module<setType,any> = {
  namespaced: true,
  state: {
    // 隐藏侧边栏
    hiddenSideBar: getConfig().HiddenSideBar,
  },
  mutations:{
    CHANGE_SETTING:(state,data)=>{
      state[data.key] = data.value;
    }
  },
  actions: {
    changeSetting({commit},data) {
      console.log(data);
      commit('CHANGE_SETTING',data);
    }
  }
};
export default settingsModule