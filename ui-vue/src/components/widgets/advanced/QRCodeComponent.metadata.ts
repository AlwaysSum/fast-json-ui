import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'qrcode',
  name: '二维码',
  icon: '� QR',
  category: 'advanced',
  defaultConfig: {
    type: 'qrcode',
    text: '',
    size: 128,
    qrMargin: 0,
    width: '',
    height: '',
    padding: '',
    margin: '',
    backgroundColor: '',
    borderRadius: '',
    boxShadow: '',
  },
  properties: [
    { name: 'text', label: '内容', type: 'string', defaultValue: '', required: true, group: 'content', groupLabel: '内容' },
    { name: 'size', label: '尺寸(px)', type: 'number', defaultValue: 128, group: 'size', groupLabel: '尺寸' },
    { name: 'qrMargin', label: '二维码边距(px)', type: 'number', defaultValue: 0, group: 'spacing', groupLabel: '间距' },
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