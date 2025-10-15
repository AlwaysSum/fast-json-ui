import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// 顶层页面
import HomePage from '../pages/HomePage.vue';
import SingleEditorPage from '../pages/SingleEditorPage.vue';
// 应用编辑页及其子视图
import AppEditorLayout from '../pages/app/AppEditorLayout.vue';
import LayersView from '../pages/app/LayersView.vue';
import PagesView from '../pages/app/PagesView.vue';
import DialogsView from '../pages/app/DialogsView.vue';
import CustomComponentsView from '../pages/app/CustomComponentsView.vue';
import DataView from '../pages/app/DataView.vue';
import ApiView from '../pages/app/ApiView.vue';
import AppSettingsView from '../pages/app/AppSettingsView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/single', name: 'single', component: SingleEditorPage },
  {
    path: '/app/:appId',
    component: AppEditorLayout,
    children: [
      { path: '', redirect: { name: 'layers' } },
      { path: 'layers', name: 'layers', component: LayersView },
      { path: 'pages', name: 'pages', component: PagesView },
      { path: 'dialogs', name: 'dialogs', component: DialogsView },
      { path: 'custom', name: 'custom', component: CustomComponentsView },
      { path: 'data', name: 'data', component: DataView },
      { path: 'api', name: 'api', component: ApiView },
      { path: 'settings', name: 'settings', component: AppSettingsView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;