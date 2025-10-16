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

// ===== 数据管理（变量 / 复合变量 / 函数） =====
export type DataEntryType = 'var' | 'composite' | 'func';
export type DataValueType = 'number' | 'string' | 'boolean' | 'object' | 'array' | 'color';
export interface DataEntry {
  id: string;
  name: string;
  type: DataEntryType;
  // 统一的类型标识：
  // - 对于变量：代表值的类型
  // - 对于复合变量、函数：代表表达式或函数返回值类型
  valueType?: DataValueType;
  // 变量存值；复合变量与函数使用 expr
  value?: any;
  expr?: string; // 表达式或函数体
  // 历史版本：变量记录 value；表达式记录 expr
  versions?: Array<{ expr?: string; value?: any; time: string }>; // 历史版本
}
export interface AppDataSection {
  vars: DataEntry[];
  composites: DataEntry[];
  funcs: DataEntry[];
}

export interface AppConfigFile {
  name: string; // 应用名称
  createtime: string; // YYYY-MM-DD
  pages: AppPageEntry[];
  dialogs?: AppDialogEntry[];
  customWidgets?: CustomWidgetEntry[];
  data?: AppDataSection; // 应用级数据（变量/复合变量/函数）
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

function formatDateTime(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
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

// 统一清理旧版 localStorage 键，避免与统一的 fju-app-config-<appId> 产生混淆
function cleanupLegacyKeys(appId: string, cfg?: AppConfigFile) {
  try {
    // 列表类旧键
    localStorage.removeItem(STORAGE_PAGES_PREFIX + appId);
    localStorage.removeItem(STORAGE_DIALOGS_PREFIX + appId);
    localStorage.removeItem(STORAGE_CUSTOM_PREFIX + appId);
    // 逐项旧配置键（页面/弹窗/自定义组件）按 cfg 提示清理
    const pages = cfg?.pages || [];
    for (const p of pages) { try { localStorage.removeItem(`${STORAGE_PAGE_CONFIG_PREFIX}${appId}-${p.id}`); } catch {} }
    const dialogs = (cfg?.dialogs || []) as Array<{ id: string }>
    for (const d of dialogs) { try { localStorage.removeItem(`${STORAGE_DIALOG_CONFIG_PREFIX}${appId}-${d.id}`); } catch {} }
    const customWidgets = (cfg?.customWidgets || []) as Array<{ id: string }>
    for (const w of customWidgets) { try { localStorage.removeItem(`${STORAGE_CUSTOM_CONFIG_PREFIX}${appId}-${w.id}`); } catch {} }
    // 再做一次兜底：枚举 localStorage 删除所有以旧前缀开头的键
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || '';
        if (!k) continue;
        if (k === STORAGE_PAGES_PREFIX + appId || k === STORAGE_DIALOGS_PREFIX + appId || k === STORAGE_CUSTOM_PREFIX + appId) {
          try { localStorage.removeItem(k); } catch {}
          continue;
        }
        if (k.startsWith(`${STORAGE_PAGE_CONFIG_PREFIX}${appId}-`) || k.startsWith(`${STORAGE_DIALOG_CONFIG_PREFIX}${appId}-`) || k.startsWith(`${STORAGE_CUSTOM_CONFIG_PREFIX}${appId}-`)) {
          try { localStorage.removeItem(k); } catch {}
        }
      }
    } catch {}
  } catch {}
}

function migrateFromLegacy(appId: string): AppConfigFile | null {
  // 旧版页面列表
  const pagesList = readJSON<Array<{ id: string; name: string; path: string }>>(STORAGE_PAGES_PREFIX + appId);
  // 如果页面列表不存在，认为无需迁移
  if (!pagesList || !Array.isArray(pagesList) || pagesList.length === 0) { return null; }
  const pages: AppPageEntry[] = pagesList.map((p) => {
    const cfg = readJSON<ComponentConfig>(`${STORAGE_PAGE_CONFIG_PREFIX}${appId}-${p.id}`) || defaultPageSchema(`页面：${p.name}`);
    return { id: p.id, name: p.name, desc: '使用可视化编辑器自定义页面', path: p.path, schema: cfg, vars: {} };
  });
  // 旧版弹窗列表
  const legacyDialogs = readJSON<Array<{ id: string; name: string }>>(STORAGE_DIALOGS_PREFIX + appId) || [];
  const dialogs: AppDialogEntry[] = legacyDialogs.map((d) => {
    const cfg = readJSON<ComponentConfig>(`${STORAGE_DIALOG_CONFIG_PREFIX}${appId}-${d.id}`) || defaultDialogSchema(`弹窗：${d.name}`);
    return { id: d.id, name: d.name, schema: cfg, vars: {} };
  });
  // 旧版自定义组件列表
  const legacyCustoms = readJSON<Array<{ id: string; name: string }>>(STORAGE_CUSTOM_PREFIX + appId) || [];
  const customWidgets: CustomWidgetEntry[] = legacyCustoms.map((w) => {
    const cfg = readJSON<ComponentConfig>(`${STORAGE_CUSTOM_CONFIG_PREFIX}${appId}-${w.id}`) || defaultCustomWidgetSchema(`组件：${w.name}`);
    return { id: w.id, name: w.name, schema: cfg, vars: {} };
  });
  const cfg: AppConfigFile = {
    name: `应用/${appId}`,
    createtime: formatDate(),
    pages,
    dialogs,
    customWidgets,
    data: { vars: [], composites: [], funcs: [] },
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
      if (!existing.data) existing.data = { vars: [], composites: [], funcs: [] };
      // 迁移老数据：变量可能只有 expr，将其迁移为 value（字符串），并设置默认类型
      existing.data.vars = (existing.data.vars || []).map((v) => {
        if ((v as any).expr && (v as any).value === undefined) {
          return { ...v, value: (v as any).expr, expr: undefined, valueType: v.valueType || 'string' } as DataEntry;
        }
        return { ...v, valueType: v.valueType || 'string' } as DataEntry;
      });
      existing.data.composites = (existing.data.composites || []).map((c) => ({ ...c, expr: c.expr || '', valueType: c.valueType || 'string' } as DataEntry));
      existing.data.funcs = (existing.data.funcs || []).map((f) => ({ ...f, expr: f.expr || '', valueType: f.valueType || 'string' } as DataEntry));
      return existing;
    }
    // 尝试从旧数据迁移
    const migrated = migrateFromLegacy(appId);
    if (migrated) {
      writeJSON(key, migrated);
      // 迁移后清理旧键，避免后续视图误读
      cleanupLegacyKeys(appId, migrated);
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
      data: { vars: [], composites: [], funcs: [] },
      version: '1.0.0',
    };
    writeJSON(key, def);
    return def;
  },

  save(appId: string, cfg: AppConfigFile) {
    writeJSON(STORAGE_APP_CONFIG_PREFIX + appId, cfg);
    // 保存后清理旧键，确保只保留统一配置
    cleanupLegacyKeys(appId, cfg);
    // 统一派发配置变更事件，方便各子视图刷新（如 Pages/Dialogs/Data 等）
    try {
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('fju-app-config-changed', { detail: { appId } }));
      }
    } catch {}
  },

  // 删除应用配置（用于从 HomePage 中删除应用时清理配置）
  removeApp(appId: string) {
    try {
      localStorage.removeItem(STORAGE_APP_CONFIG_PREFIX + appId);
      // 额外清理旧键，避免遗留
      cleanupLegacyKeys(appId);
      // 清理选中状态键
      try { localStorage.removeItem('fju-app-selected-' + appId); } catch {}
    } catch {}
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

  // ===== 应用数据（变量/复合变量/函数） =====
  getData(appId: string): AppDataSection {
    const cfg = this.load(appId);
    cfg.data = cfg.data || { vars: [], composites: [], funcs: [] };
    return cfg.data;
  },
  // ---- 通用帮助 ----
  privateFind(appId: string, type: DataEntryType, id: string): DataEntry | undefined {
    const data = this.getData(appId);
    if (type === 'var') return data.vars.find((x) => x.id === id);
    if (type === 'composite') return data.composites.find((x) => x.id === id);
    return data.funcs.find((x) => x.id === id);
  },
  // 注意：上述 privateFind 会重新 load 一份配置对象。
  // 在需要“修改并保存”的场景下，如果我们 mutate 的不是同一份 cfg 引用，就会出现修改未写入的情况。
  // 因此新增基于已加载 cfg 的查找方法，确保 mutate 与 save 作用于同一对象。
  privateFindInCfg(cfg: AppConfigFile, type: DataEntryType, id: string): DataEntry | undefined {
    const data = (cfg.data ||= { vars: [], composites: [], funcs: [] });
    if (type === 'var') return data.vars.find((x) => x.id === id);
    if (type === 'composite') return data.composites.find((x) => x.id === id);
    return data.funcs.find((x) => x.id === id);
  },
  privateList(appId: string, type: DataEntryType): DataEntry[] {
    const data = this.getData(appId);
    if (type === 'var') return data.vars;
    if (type === 'composite') return data.composites;
    return data.funcs;
  },
  privatePush(appId: string, item: DataEntry) {
    const cfg = this.load(appId);
    cfg.data = cfg.data || { vars: [], composites: [], funcs: [] };
    const pool = item.type === 'var' ? cfg.data.vars : item.type === 'composite' ? cfg.data.composites : cfg.data.funcs;
    pool.push(item);
    this.save(appId, cfg);
  },
  privateRemove(appId: string, type: DataEntryType, id: string) {
    const cfg = this.load(appId);
    cfg.data = cfg.data || { vars: [], composites: [], funcs: [] };
    if (type === 'var') cfg.data.vars = (cfg.data.vars || []).filter((x) => x.id !== id);
    else if (type === 'composite') cfg.data.composites = (cfg.data.composites || []).filter((x) => x.id !== id);
    else cfg.data.funcs = (cfg.data.funcs || []).filter((x) => x.id !== id);
    this.save(appId, cfg);
  },
  privateRename(appId: string, type: DataEntryType, id: string, newName: string) {
    const cfg = this.load(appId);
    const it = this.privateFindInCfg(cfg, type, id);
    if (it) {
      it.name = newName.trim() || it.name;
      this.save(appId, cfg);
    }
  },
  privateSetType(appId: string, type: DataEntryType, id: string, valueType: DataValueType) {
    const cfg = this.load(appId);
    const it = this.privateFindInCfg(cfg, type, id);
    if (it) {
      it.valueType = valueType;
      this.save(appId, cfg);
    }
  },
  privateSetExpr(appId: string, type: DataEntryType, id: string, expr: string) {
    const cfg = this.load(appId);
    const it = this.privateFindInCfg(cfg, type, id);
    if (it) {
      if (!Array.isArray(it.versions)) it.versions = [];
      // 保存旧版本
      if (typeof it.expr === 'string' && it.expr !== expr) {
        it.versions.push({ expr: it.expr, time: formatDateTime() });
        if (it.versions.length > 50) it.versions.shift(); // 限制历史长度
      }
      it.expr = expr;
      this.save(appId, cfg);
    }
  },
  privateSetValue(appId: string, id: string, value: any) {
    const cfg = this.load(appId);
    const it = this.privateFindInCfg(cfg, 'var', id);
    if (it) {
      if (!Array.isArray(it.versions)) it.versions = [];
      // 保存旧版本
      if (it.value !== value) {
        it.versions.push({ value: it.value, time: formatDateTime() });
        if (it.versions.length > 50) it.versions.shift();
      }
      it.value = value;
      this.save(appId, cfg);
    }
  },
  privateRollbackLatest(appId: string, type: DataEntryType, id: string) {
    const cfg = this.load(appId);
    const it = this.privateFindInCfg(cfg, type, id);
    if (it && Array.isArray(it.versions) && it.versions.length > 0) {
      const last = it.versions.pop();
      if (last) {
        if (type === 'var') it.value = (last as any).value;
        else it.expr = last.expr as string;
      }
      this.save(appId, cfg);
      return true;
    }
    return false;
  },
  // ---- 变量 ----
  listVars(appId: string): DataEntry[] { return this.privateList(appId, 'var'); },
  addVar(appId: string, name: string): DataEntry {
    const id = Math.random().toString(36).slice(2, 8);
    const entry: DataEntry = { id, name: name.trim() || '未命名变量', type: 'var', valueType: 'string', value: '' };
    this.privatePush(appId, entry);
    return entry;
  },
  renameVar(appId: string, id: string, newName: string) { this.privateRename(appId, 'var', id, newName); },
  removeVar(appId: string, id: string) { this.privateRemove(appId, 'var', id); },
  // 新：变量值管理
  getVarValue(appId: string, id: string): any { return this.privateFind(appId, 'var', id)?.value; },
  setVarValue(appId: string, id: string, value: any) { this.privateSetValue(appId, id, value); },
  setVarType(appId: string, id: string, valueType: DataValueType) { this.privateSetType(appId, 'var', id, valueType); },
  rollbackVar(appId: string, id: string): boolean { return this.privateRollbackLatest(appId, 'var', id); },
  // ---- 复合变量 ----
  listComposites(appId: string): DataEntry[] { return this.privateList(appId, 'composite'); },
  addComposite(appId: string, name: string): DataEntry {
    const id = Math.random().toString(36).slice(2, 8);
    const entry: DataEntry = { id, name: name.trim() || '未命名复合变量', type: 'composite', expr: '', valueType: 'string' };
    this.privatePush(appId, entry);
    return entry;
  },
  renameComposite(appId: string, id: string, newName: string) { this.privateRename(appId, 'composite', id, newName); },
  removeComposite(appId: string, id: string) { this.privateRemove(appId, 'composite', id); },
  getCompositeExpr(appId: string, id: string): string { return this.privateFind(appId, 'composite', id)?.expr || ''; },
  setCompositeExpr(appId: string, id: string, expr: string) { this.privateSetExpr(appId, 'composite', id, expr); },
  setCompositeType(appId: string, id: string, valueType: DataValueType) { this.privateSetType(appId, 'composite', id, valueType); },
  rollbackComposite(appId: string, id: string): boolean { return this.privateRollbackLatest(appId, 'composite', id); },
  // ---- 函数 ----
  listFuncs(appId: string): DataEntry[] { return this.privateList(appId, 'func'); },
  addFunc(appId: string, name: string): DataEntry {
    const id = Math.random().toString(36).slice(2, 8);
    const entry: DataEntry = { id, name: name.trim() || '未命名函数', type: 'func', expr: '(...args) => {\n  // TODO: 实现函数体\n  return args[0];\n}', valueType: 'string' };
    this.privatePush(appId, entry);
    return entry;
  },
  renameFunc(appId: string, id: string, newName: string) { this.privateRename(appId, 'func', id, newName); },
  removeFunc(appId: string, id: string) { this.privateRemove(appId, 'func', id); },
  getFuncExpr(appId: string, id: string): string { return this.privateFind(appId, 'func', id)?.expr || ''; },
  setFuncExpr(appId: string, id: string, expr: string) { this.privateSetExpr(appId, 'func', id, expr); },
  setFuncType(appId: string, id: string, valueType: DataValueType) { this.privateSetType(appId, 'func', id, valueType); },
  rollbackFunc(appId: string, id: string): boolean { return this.privateRollbackLatest(appId, 'func', id); },
};

export default AppConfigStore;