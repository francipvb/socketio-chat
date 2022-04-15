import { createPinia, PiniaVuePlugin } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap/scss/bootstrap.scss";

const pinia = createPinia();

createApp(App).use(pinia).mount("#app");
