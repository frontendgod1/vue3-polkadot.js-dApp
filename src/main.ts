import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { store, key } from "./store";

import "./assets/main.css";

const app = createApp(App);

app.use(router);

app.use(store, key);

app.mount("#app");
