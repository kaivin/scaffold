import { UserConfigExport, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import ip from 'ip';
import { warpperEnv, regExps } from "./build";
import ElementPlus from "unplugin-element-plus/vite";
import { svgBuilder } from './src/plugins/svgBuilder/index';
import { viteMockServe } from "vite-plugin-mock";
import svgLoader from "vite-svg-loader";
// import themePreprocessorPlugin from "@zougt/vite-plugin-theme-preprocessor";

const ipStr = ip.address();
// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd();
const resolve = (dir: string) => path.join(__dirname, dir)
// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
	const {
    VITE_PORT,
    VITE_OUTDIR,
    VITE_PUBLIC_PATH,
    VITE_PROXY_DOMAIN,
    VITE_PROXY_DOMAIN_REAL
  } = warpperEnv(loadEnv(mode, root));
	const prodMock = true;
	return {
		base:VITE_PUBLIC_PATH,
		root,
    // css: {
    //   // https://github.com/vitejs/vite/issues/5833
    //   postcss: {
    //     plugins: [
    //       {
    //         postcssPlugin: "internal:charset-removal",
    //         AtRule: {
    //           charset: atRule => {
    //             if (atRule.name === "charset") {
    //               atRule.remove();
    //             }
    //           }
    //         }
    //       }
    //     ]
    //   }
    // },
		// 开发服务
		server:{
			https:false,
			port:VITE_PORT,
			host:ipStr,
			// 本地跨域代理
			proxy:VITE_PROXY_DOMAIN_REAL.length>0?{
				[VITE_PROXY_DOMAIN]:{
					target:VITE_PROXY_DOMAIN_REAL,
					changeOrigin:true,
					rewrite:(path:string)=>regExps(path,VITE_PROXY_DOMAIN)
				}
			}:null,
			open:`http://${ipStr}:${VITE_PORT}`
		},
		build:{
			outDir:VITE_OUTDIR,
			sourcemap:false,
			brotliSize:false,
			// 消除打包大小超过500kb警告
			chunkSizeWarningLimit:2000,
		},
    optimizeDeps: {
      include: [
        "element-plus/lib/locale/lang/zh-cn",
        "element-plus/lib/locale/lang/en",
      ],
      exclude: ["@zougt/vite-plugin-theme-preprocessor/dist/browser-utils"]
    },
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
			}),
      // 自定义主题
      // themePreprocessorPlugin({
      //   scss: {
      //     multipleScopeVars: [
      //       {
      //         scopeName: "layout-theme-default",
      //         path: resolve("src/layout/theme/default-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-dusk",
      //         path: resolve("src/layout/theme/dusk-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-volcano",
      //         path: resolve("src/layout/theme/volcano-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-yellow",
      //         path: resolve("src/layout/theme/yellow-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-mingQing",
      //         path: resolve("src/layout/theme/mingQing-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-auroraGreen",
      //         path: resolve("src/layout/theme/auroraGreen-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-pink",
      //         path: resolve("src/layout/theme/pink-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-saucePurple",
      //         path: resolve("src/layout/theme/saucePurple-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-light",
      //         path: resolve("src/layout/theme/light-vars.scss")
      //       },
      //       {
      //         scopeName: "layout-theme-dark",
      //         path: resolve("src/layout/theme/dark-vars.scss")
      //       },
      //     ],
      //     // 默认取 multipleScopeVars[0].scopeName
      //     defaultScopeName: "",
      //     // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
      //     extract: true,
      //     // 独立主题css文件的输出路径，默认取 viteConfig.build.assetsDir 相对于 (viteConfig.build.outDir)
      //     outputDir: "",
      //     // 会选取defaultScopeName对应的主题css文件在html添加link
      //     themeLinkTagId: "head",
      //     // "head"||"head-prepend" || "body" ||"body-prepend"
      //     themeLinkTagInjectTo: "head",
      //     // 是否对抽取的css文件内对应scopeName的权重类名移除
      //     removeCssScopeName: false,
      //     // 可以自定义css文件名称的函数
      //     customThemeCssFileName: scopeName => scopeName
      //   }
      // }),
		],
		resolve: {
			alias: {
				'@': resolve('src'),
        '#': resolve('types'),
        '^': resolve('build'),
				'vue':'vue/dist/vue.esm-bundler.js',
				//解决开发环境下的警告
				"vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
			}
		}
	}
}
