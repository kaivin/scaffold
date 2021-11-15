<script setup lang="ts">
import { infoType } from "./type";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import { getLogin } from "@/api/user";
import { storageSession } from "@/utils/storage";
import { warnMessage, successMessage } from "@/utils/message";
import info, { ContextProps } from "./components/default/index.vue";

const router = useRouter();
const contextInfo: ContextProps = reactive({
  userName: "",
  passWord: "",
});
const toPage = (info: Object): void => {
  storageSession.setItem("userInfo", info);
  router.push("/");
};
// 登录
const onLogin = async () => {
  let { userName, passWord } = contextInfo;
  let { code, info,data, accessToken }: infoType = await getLogin({
    username: userName,
    password: passWord,
  });
  const userInfo:any = data;
  userInfo.accessToken = accessToken
  code === 0
    ? successMessage(info) &&
      toPage(userInfo)
    : warnMessage(info);
};

</script>

<template>
  <div class="login">
    <info
      :ruleForm="contextInfo"
      @on-behavior="onLogin"
    />
  </div>
</template>
