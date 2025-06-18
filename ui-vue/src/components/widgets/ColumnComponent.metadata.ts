import { WidgetMeta } from '../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'column',
  name: '列布局',
  icon: '⬆️⬇️',
  category: 'layout',
  defaultConfig: {
    type: 'column',
    children: [],
    gap: '',
    align: '',
    justify: '',
    padding: '',
    margin: '',
    backgroundColor: '',
    borderRadius: '',
    boxShadow: '',
    width: '',
    height: ''
  },
  properties: [
    { name: 'children', label: '子组件', type: 'children' },
    { name: 'gap', label: '间距', type: 'string', defaultValue: '' },
    { name: 'align', label: '垂直对齐', type: 'select', defaultValue: '', options: [
      { label: '顶部', value: 'flex-start' },
      { label: '居中', value: 'center' },
      { label: '底部', value: 'flex-end' },
      { label: '拉伸', value: 'stretch' }
    ] },
    { name: 'justify', label: '主轴对齐', type: 'select', defaultValue: '', options: [
      { label: '起始', value: 'flex-start' },
      { label: '居中', value: 'center' },
      { label: '结尾', value: 'flex-end' },
      { label: '平均分布', value: 'space-between' },
      { label: '均匀分布', value: 'space-around' },
      { label: '等间距', value: 'space-evenly' }
    ] },
    { name: 'padding', label: '内边距', type: 'string', defaultValue: '' },
    { name: 'margin', label: '外边距', type: 'string', defaultValue: '' },
    { name: 'backgroundColor', label: '背景色', type: 'color', defaultValue: '' },
    { name: 'borderRadius', label: '圆角', type: 'string', defaultValue: '' },
    { name: 'boxShadow', label: '阴影', type: 'string', defaultValue: '' },
    { name: 'width', label: '宽度', type: 'string', defaultValue: '' },
    { name: 'height', label: '高度', type: 'string', defaultValue: '' }
  ]
};

export default metadata; 