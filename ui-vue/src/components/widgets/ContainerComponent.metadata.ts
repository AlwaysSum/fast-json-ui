import { WidgetMeta } from '../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'container',
  name: '容器',
  icon: '📦',
  category: 'layout',
  defaultConfig: {
    type: 'container',
    children: []
  },
  properties: [
    { name: 'children', label: '子组件', type: 'children' }
  ]
};

export default metadata; 