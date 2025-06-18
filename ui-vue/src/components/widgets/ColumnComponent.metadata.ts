import { WidgetMeta } from '../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'column',
  name: '列布局',
  icon: '⬆️⬇️',
  category: 'layout',
  defaultConfig: {
    type: 'column',
    children: []
  },
  properties: [
    { name: 'children', label: '子组件', type: 'children' }
  ]
};

export default metadata; 