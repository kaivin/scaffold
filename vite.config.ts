import { UserConfigExport, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import ElementPlus from "unplugin-element-plus/vite";
import { svgBuilder } from './src/plugins/svgBuilder/index';
import { viteMockServe } from "vite-plugin-mock";
import svgLoader from "vite-svg-loader";
const resolve = (dir: string) => path.join(__dirname, dir)
// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
	const prodMock = true;
	return {
		plugins: [
			vue(),
			[svgBuilder('./src/assets/icons/svg/')],
			ElementPlus({}),
      svgLoader(),
			viteMockServe({
				mockPath: "./mock", // 模拟接口api文件存放的文件夹
				watchFiles: true, // 将监视文件夹中的文件更改。 并实时同步到请求结果
				localEnabled: command === "serve", // 设置是否启用本地 xxx.ts 文件，不要在生产环境中打开它.设置为 false 将禁用 mock 功能
				prodEnabled: command !== "serve" && prodMock, // 设置生产环境是否启用 mock 功能
				injectCode: `
					import { setupProdMockServer } from './mockProdServer';
					setupProdMockServer();
				`, // 如果生产环境开启了mock功能，该代码会注入到injectFile对应的文件的底部，默认为main.{ts,js}
				injectFile:path.resolve(process.cwd(),'src/main.{ts,js}'),
				logger: true
			})
		],
		resolve: {
			alias: {
				'@': resolve('src'),
        '#': resolve('types'),
				'vue':'vue/dist/vue.esm-bundler.js'
			}
		},
    define: {
			'process.env': {},
      __INTLIFY_PROD_DEVTOOLS__: false
    }
	}
}
