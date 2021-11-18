import { storageLocal } from "@/utils/storage";
import { Module } from 'vuex'

interface AppState {
    sidebar: {
      opened: boolean;
      withoutAnimation: boolean;
    };
}

const appModule: Module<AppState,any> = {
    namespaced: true,
    state: {
        sidebar:{
            opened:storageLocal.getItem("sidebarStatus")
            ? !!+storageLocal.getItem("sidebarStatus")
            : true,
            withoutAnimation:false
        }
    },
    mutations:{
        TOGGLE_SIDEBAR:(state)=> {
            state.sidebar.opened = !state.sidebar.opened;
            state.sidebar.withoutAnimation = false;
            if (state.sidebar.opened) {
              storageLocal.setItem("sidebarStatus", 1);
            } else {
              storageLocal.setItem("sidebarStatus", 0);
            }
        },
        CLOSE_SIDEBAR:(state,withoutAnimation: boolean)=> {
            storageLocal.setItem("sidebarStatus", 0);
            state.sidebar.opened = false;
            state.sidebar.withoutAnimation = withoutAnimation;
        },
    },
    actions: {
        toggleSideBar({commit}) {
            commit('TOGGLE_SIDEBAR');
        },
        closeSideBar({commit},{withoutAnimation}) {
            commit('CLOSE_SIDEBAR', withoutAnimation);
        },
    }
  };
  export default appModule