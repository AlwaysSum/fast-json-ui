import { WidgetMeta } from '../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'stack',
  name: '堆叠布局',
  icon: '🗂️',
  category: 'layout',
  defaultConfig: {
    type: 'stack',
    children: []
  },
  properties: [
    { name: 'children', label: '子组件', type: 'children' }
  ]
};

export default metadata; 