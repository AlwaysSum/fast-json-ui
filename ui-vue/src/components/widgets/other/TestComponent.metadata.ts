import { WidgetMeta } from '../../WidgetFactory';

export const metadata: WidgetMeta = {
  type: 'test',
  name: '测试',
  icon: '🧪',
  category: 'other',
  defaultConfig: {
    type: 'test',
    value: ''
  },
  properties: [
    { name: 'value', label: '测试值', type: 'string', defaultValue: '' }
  ]
};

export default metadata; 