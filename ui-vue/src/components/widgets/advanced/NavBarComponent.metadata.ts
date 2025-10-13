import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'navbar',
  name: '导航栏',
  icon: '🧭',
  category: 'advanced',
  defaultConfig: {
    type: 'navbar',
    title: '导航栏',
    showBack: false,
    backText: '返回',
    onBack: '',
    menus: [],
    width: '100%',
    height: '48px',
    padding: '0 16px',
    margin: '',
    backgroundColor: '',
    borderRadius: '',
    boxShadow: '',
  },
  properties: [
    { name: 'title', label: '标题', type: 'string', defaultValue: '导航栏', group: 'content', groupLabel: '内容' },
    { name: 'showBack', label: '显示返回', type: 'boolean', defaultValue: false, group: 'state', groupLabel: '状态' },
    { name: 'backText', label: '返回文案', type: 'string', defaultValue: '返回', group: 'content', groupLabel: '内容' },
    { name: 'onBack', label: '返回事件', type: 'method', defaultValue: '', group: 'event', groupLabel: '事件' },
    { name: 'menus', label: '右侧菜单', type: 'array', group: 'structure', groupLabel: '结构' },
    { name: 'width', label: '宽度', type: 'string', defaultValue: '100%', group: 'size', groupLabel: '尺寸' },
    { name: 'height', label: '高度', type: 'string', defaultValue: '48px', group: 'size', groupLabel: '尺寸' },
    { name: 'padding', label: '内边距', type: 'string', defaultValue: '0 16px', group: 'spacing', groupLabel: '间距' },
    { name: 'margin', label: '外边距', type: 'string', defaultValue: '', group: 'spacing', groupLabel: '间距' },
    { name: 'backgroundColor', label: '背景色', type: 'color', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'borderRadius', label: '圆角', type: 'string', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'boxShadow', label: '阴影', type: 'string', defaultValue: '', group: 'style', groupLabel: '样式' },
  ]
};

export default metadata;