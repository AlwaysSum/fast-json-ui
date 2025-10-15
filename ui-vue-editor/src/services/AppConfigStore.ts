import type { ComponentConfig } from 'fast-json-ui-vue';

export interface AppPageEntry {
  id: string | number;
  name: string;
  desc?: string;
  path: string;
  schema: ComponentConfig;
  vars?: Record<string, any>;
}

export interface AppDialogEntry {
  id: string;
  name: string;
  schema: ComponentConfig;
  vars?: Record<string, any>;
}

export interface CustomWidgetEntry {
  id: string;
  name: string;
  schema: ComponentConfig;
  vars?: Record<string, any>;
}

export interface AppConfigFile {
  name: string; // 应用名称
  createtime: string; // YYYY-MM-DD
  pages: AppPageEntry[];
  dialogs?: AppDialogEntry[];
  customWidgets?: CustomWidgetEntry[];
  version: string; // 配置版本
}

const STORAGE_APP_CONFIG_PREFIX = 'fju-app-config-';
const STORAGE_PAGES_PREFIX = 'fju-app-pages-';
const STORAGE_PAGE_CONFIG_PREFIX = 'fju-app-page-config-';
const STORAGE_DIALOGS_PREFIX = 'fju-app-dialogs-';
const STORAGE_DIALOG_CONFIG_PREFIX = 'fju-app-dialog-config-';
const STORAGE_CUSTOM_PREFIX = 'fju-app-custom-';
const STORAGE_CUSTOM_CONFIG_PREFIX = 'fju-app-custom-config-';

function formatDate(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function defaultPageSchema(label = '欢迎使用 Fast-JSON-UI'): ComponentConfig {
  return { type: 'column', children: [{ type: 'text', text: label }] } as ComponentConfig;
}

function defaultDialogSchema(label = '未命名弹窗'): ComponentConfig {
  return { type: 'column', children: [{ type: 'text', text: label }] } as ComponentConfig;
}

function defaultCustomWidgetSchema(label = '未命名组件'): ComponentConfig {
  return { type: 'column', children: [{ type: 'text', text: label }] } as ComponentConfig;
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}

function writeJSON(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function migrateFromLegacy(appId: string): AppConfigFile | null {
  const listKey = STORAGE_PAGES_PREFIX + appId;
  const pagesList = readJSON<Array<{ id: string; name: string; path: string }>>(listKey);
  if (!pagesList || !Array.isArray(pagesList) || pagesList.length === 0) {
    return null;
  }
  const pages: AppPageEntry[] = pagesList.map((p) => {
    const cfg = readJSON<ComponentConfig>(`${STORAGE_PAGE_CONFIG_PREFIX}${appId}-${p.id}`) || defaultPageSchema(`页面：${p.name}`);
    return { id: p.id, name: p.name, desc: '使用可视化编辑器自定义页面', path: p.path, schema: cfg, vars: {} };
  });
  const cfg: AppConfigFile = {
    name: `应用/${appId}`,
    createtime: formatDate(),
    pages,
    version: '1.0.0',
  };
  return cfg;
}

export const AppConfigStore = {
  load(appId: string): AppConfigFile {
    const key = STORAGE_APP_CONFIG_PREFIX + appId;
    const existing = readJSON<AppConfigFile>(key);
    if (existing && Array.isArray(existing.pages)) {
      // 兼容旧版本，补全新字段
      if (!Array.isArray(existing.dialogs)) existing.dialogs = [];
      if (!Array.isArray(existing.customWidgets)) existing.customWidgets = [];
      return existing;
    }
    // 尝试从旧数据迁移
    const migrated = migrateFromLegacy(appId);
    if (migrated) {
      writeJSON(key, migrated);
      return migrated;
    }
    // 初始化一个默认配置
    const def: AppConfigFile = {
      name: `应用/${appId}`,
      createtime: formatDate(),
      pages: [
        {
          id: 'home',
          name: '首页',
          desc: '使用可视化编辑器自定义页面',
          path: '/home',
          schema: defaultPageSchema('欢迎使用编辑器（首页）'),
          vars: {},
        },
      ],
      dialogs: [],
      customWidgets: [],
      version: '1.0.0',
    };
    writeJSON(key, def);
    return def;
  },

  save(appId: string, cfg: AppConfigFile) {
    writeJSON(STORAGE_APP_CONFIG_PREFIX + appId, cfg);
  },

  getName(appId: string): string {
    return this.load(appId).name;
  },

  setName(appId: string, name: string) {
    const cfg = this.load(appId);
    cfg.name = name.trim() || cfg.name;
    this.save(appId, cfg);
  },

  getPages(appId: string): AppPageEntry[] {
    return this.load(appId).pages;
  },

  addPage(appId: string, name: string, path: string): AppPageEntry {
    const cfg = this.load(appId);
    const id = Math.random().toString(36).slice(2, 8);
    const entry: AppPageEntry = {
      id,
      name: name.trim() || '未命名页面',
      desc: '使用可视化编辑器自定义页面',
      path: path.trim() || '/',
      schema: defaultPageSchema(`页面：${name}`),
      vars: {},
    };
    cfg.pages.push(entry);
    this.save(appId, cfg);
    return entry;
  },

  renamePage(appId: string, pageId: string | number, newName: string) {
    const cfg = this.load(appId);
    const p = cfg.pages.find((x) => String(x.id) === String(pageId));
    if (p) {
      p.name = newName.trim() || p.name;
      this.save(appId, cfg);
    }
  },

  getPageSchema(appId: string, pageId: string | number): ComponentConfig | null {
    const cfg = this.load(appId);
    const p = cfg.pages.find((x) => String(x.id) === String(pageId));
    return p ? p.schema : null;
  },

  setPageSchema(appId: string, pageId: string | number, schema: ComponentConfig) {
    const cfg = this.load(appId);
    const p = cfg.pages.find((x) => String(x.id) === String(pageId));
    if (p) {
      p.schema = schema;
      this.save(appId, cfg);
    }
  },
  getPageVars(appId: string, pageId: string | number): Record<string, any> {
    const cfg = this.load(appId);
    const p = cfg.pages.find((x) => String(x.id) === String(pageId));
    return p?.vars || {};
  },
  setPageVars(appId: string, pageId: string | number, vars: Record<string, any>) {
    const cfg = this.load(appId);
    const p = cfg.pages.find((x) => String(x.id) === String(pageId));
    if (p) { p.vars = vars || {}; this.save(appId, cfg); }
  },
  
  // ===== Dialogs =====
  getDialogs(appId: string): AppDialogEntry[] {
    return this.load(appId).dialogs || [];
  },
  addDialog(appId: string, name: string): AppDialogEntry {
    const cfg = this.load(appId);
    const id = Math.random().toString(36).slice(2, 8);
    const entry: AppDialogEntry = { id, name: name.trim() || '未命名弹窗', schema: defaultDialogSchema(`弹窗：${name}`), vars: {} };
    cfg.dialogs = cfg.dialogs || [];
    cfg.dialogs.push(entry);
    this.save(appId, cfg);
    return entry;
  },
  renameDialog(appId: string, dialogId: string, newName: string) {
    const cfg = this.load(appId);
    const d = (cfg.dialogs || []).find((x) => String(x.id) === String(dialogId));
    if (d) { d.name = newName.trim() || d.name; this.save(appId, cfg); }
  },
  getDialogSchema(appId: string, dialogId: string): ComponentConfig | null {
    const cfg = this.load(appId);
    const d = (cfg.dialogs || []).find((x) => String(x.id) === String(dialogId));
    return d ? d.schema : null;
  },
  setDialogSchema(appId: string, dialogId: string, schema: ComponentConfig) {
    const cfg = this.load(appId);
    let d = (cfg.dialogs || []).find((x) => String(x.id) === String(dialogId));
    if (!d) {
      d = { id: dialogId, name: dialogId, schema, vars: {} };
      cfg.dialogs = cfg.dialogs || [];
      cfg.dialogs.push(d);
    } else {
      d.schema = schema;
    }
    this.save(appId, cfg);
  },
  getDialogVars(appId: string, dialogId: string): Record<string, any> {
    const cfg = this.load(appId);
    const d = (cfg.dialogs || []).find((x) => String(x.id) === String(dialogId));
    return d?.vars || {};
  },
  setDialogVars(appId: string, dialogId: string, vars: Record<string, any>) {
    const cfg = this.load(appId);
    const d = (cfg.dialogs || []).find((x) => String(x.id) === String(dialogId));
    if (d) { d.vars = vars || {}; this.save(appId, cfg); }
  },

  // ===== Custom Widgets =====
  getCustomWidgets(appId: string): CustomWidgetEntry[] {
    return this.load(appId).customWidgets || [];
  },
  addCustomWidget(appId: string, name: string): CustomWidgetEntry {
    const cfg = this.load(appId);
    const id = Math.random().toString(36).slice(2, 8);
    const entry: CustomWidgetEntry = { id, name: name.trim() || '未命名组件', schema: defaultCustomWidgetSchema(`组件：${name}`), vars: {} };
    cfg.customWidgets = cfg.customWidgets || [];
    cfg.customWidgets.push(entry);
    this.save(appId, cfg);
    return entry;
  },
  renameCustomWidget(appId: string, widgetId: string, newName: string) {
    const cfg = this.load(appId);
    const w = (cfg.customWidgets || []).find((x) => String(x.id) === String(widgetId));
    if (w) { w.name = newName.trim() || w.name; this.save(appId, cfg); }
  },
  getCustomWidgetSchema(appId: string, widgetId: string): ComponentConfig | null {
    const cfg = this.load(appId);
    const w = (cfg.customWidgets || []).find((x) => String(x.id) === String(widgetId));
    return w ? w.schema : null;
  },
  setCustomWidgetSchema(appId: string, widgetId: string, schema: ComponentConfig) {
    const cfg = this.load(appId);
    let w = (cfg.customWidgets || []).find((x) => String(x.id) === String(widgetId));
    if (!w) {
      w = { id: widgetId, name: widgetId, schema, vars: {} };
      cfg.customWidgets = cfg.customWidgets || [];
      cfg.customWidgets.push(w);
    } else {
      w.schema = schema;
    }
    this.save(appId, cfg);
  },
  getCustomWidgetVars(appId: string, widgetId: string): Record<string, any> {
    const cfg = this.load(appId);
    const w = (cfg.customWidgets || []).find((x) => String(x.id) === String(widgetId));
    return w?.vars || {};
  },
  setCustomWidgetVars(appId: string, widgetId: string, vars: Record<string, any>) {
    const cfg = this.load(appId);
    const w = (cfg.customWidgets || []).find((x) => String(x.id) === String(widgetId));
    if (w) { w.vars = vars || {}; this.save(appId, cfg); }
  },
};

export default AppConfigStore;