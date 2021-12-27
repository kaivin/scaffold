import { Module } from 'vuex'
import { multiTagsType } from "#/store";
import { storageLocal } from "@/utils/storage";

const tagsModule: Module<multiTagsType,any> = {
  namespaced: true,
  state: {
    // 存储标签页信息（路由信息）
    multiTags: storageLocal.getItem("responsive-tagSetting")?.multiTagsCache
    ? storageLocal.getItem("responsive-tags")
    : [
        {
          path: "/",
          parentPath: "/",
          meta: {
            title: "message.hshome",
            i18n: true,
            icon: "fa-house-damage",
            showLink: true
          }
        }
      ],
    multiTagsCache: storageLocal.getItem("responsive-tagSetting")?.multiTagsCache
  },
  mutations:{
    tagsCache:(state)=> {
      storageLocal.setItem("responsive-tags", state.multiTags);
    },
  },
  actions: {
    multiTagsCacheChange({state},multiTagsCache: boolean) {
      state.multiTagsCache = multiTagsCache;
      if (multiTagsCache) {
        storageLocal.setItem("responsive-tags", state.multiTags);
      } else {
        storageLocal.removeItem("responsive-tags");
      }
    },
    handleTags({state,commit},data) {
      switch (data.mode) {
        case "equal":
          state.multiTags = data.value;
          commit('tagsCache');
          break;
        case "push":
          const tagVal = data.value;
          // 判断tag是否已存在:
          const tagHasExits = state.multiTags.some(tag => {
            return tag.path === tagVal?.path;
          });
          // tag已经存在，并且realPath不存在的情况下，直接返回
          if (tagHasExits&&!tagVal?.meta?.realPath) return;
          const meta = tagVal?.meta;
          const dynamicLevel = meta?.dynamicLevel ?? -1;
          if (dynamicLevel > 0&&!tagHasExits) {
            // dynamicLevel动态路由可打开的数量
            const realPath = meta?.realPath ?? "";
            // 获取到已经打开的动态路由数, 判断是否大于dynamicLevel
            if (
              state.multiTags.filter(e => e.meta?.realPath ?? "" === realPath)
                .length >= dynamicLevel
            ) {
              // 关闭第一个
              const index = state.multiTags.findIndex(
                item => item.meta?.realPath === realPath
              );
              index !== -1 && state.multiTags.splice(index, 1);
            }
          }
          // 删除已缓存的详情路由，并将新的进行缓存
          const tagIndex = state.multiTags.findIndex(
            item => item.path === tagVal?.path
          );
          if(tagIndex !== -1){
            state.multiTags.splice(tagIndex, 1,data.value);
          }
          if (!tagHasExits){
            state.multiTags.push(data.value);
          }
          commit('tagsCache');
          break;
        case "splice":
          state.multiTags.splice(data.position?.startIndex, data.position?.length);
          commit('tagsCache');
          return state.multiTags;
          break;
        case "slice":
          return state.multiTags.slice(-1);
          break;
      }
    }
  }
};
export default tagsModule