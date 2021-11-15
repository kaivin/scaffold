import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import { RouteComponent } from 'vue-router'

declare interface Routes {
  constantRoutes:RouteComponent
  wholeRoutes:Array
}

declare interface State {
  routes: Routes
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
