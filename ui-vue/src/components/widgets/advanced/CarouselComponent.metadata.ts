import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'carousel',
  name: '轮播图',
  icon: '🖼️',
  category: 'advanced',
  defaultConfig: {
    type: 'carousel',
    children: [],
    autoplay: true,
    interval: 3000,
    loop: true,
    showIndicators: true,
    showArrows: true,
    width: '',
    height: '',
    padding: '',
    margin: '',
    backgroundColor: '',
    borderRadius: '',
    boxShadow: '',
  },
  properties: [
    { name: 'children', label: '子组件(每页)', type: 'children', group: 'structure', groupLabel: '结构' },
    { name: 'autoplay', label: '自动播放', type: 'boolean', defaultValue: true, group: 'state', groupLabel: '状态' },
    { name: 'interval', label: '间隔(ms)', type: 'number', defaultValue: 3000, group: 'state', groupLabel: '状态' },
    { name: 'loop', label: '循环播放', type: 'boolean', defaultValue: true, group: 'state', groupLabel: '状态' },
    { name: 'showIndicators', label: '显示指示点', type: 'boolean', defaultValue: true, group: 'state', groupLabel: '状态' },
    { name: 'showArrows', label: '显示箭头', type: 'boolean', defaultValue: true, group: 'state', groupLabel: '状态' },
    { name: 'width', label: '宽度', type: 'string', defaultValue: '', group: 'size', groupLabel: '尺寸' },
    { name: 'height', label: '高度', type: 'string', defaultValue: '', group: 'size', groupLabel: '尺寸' },
    { name: 'padding', label: '内边距', type: 'string', defaultValue: '', group: 'spacing', groupLabel: '间距' },
    { name: 'margin', label: '外边距', type: 'string', defaultValue: '', group: 'spacing', groupLabel: '间距' },
    { name: 'backgroundColor', label: '背景色', type: 'color', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'borderRadius', label: '圆角', type: 'string', defaultValue: '', group: 'style', groupLabel: '样式' },
    { name: 'boxShadow', label: '阴影', type: 'string', defaultValue: '', group: 'style', groupLabel: '样式' },
  ]
};

export default metadata;