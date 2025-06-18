import { WidgetMeta } from '../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'row',
  name: '行布局',
  icon: '⬅️➡️',
  category: 'layout',
  defaultConfig: {
    type: 'row',
    children: []
  },
  properties: [
    { name: 'children', label: '子组件', type: 'children' }
  ]
};

export default metadata; 