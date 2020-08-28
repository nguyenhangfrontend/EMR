import { get } from 'lodash';

export const convert = (data) => {
  if (data.data) {
   return {
     id: data.data.id,
     props: {
       value: data.data.value,
       name: data.data.name,
       api: data.data.api,
       fontSize: data.data.config ? data.data.config.fontSize : '3',
     },
     lines: data.data.layout || [],
     components: data.data.components || [],
     chunkComponent: get(data, 'data.layout', []).reduce((res, next) => ({
       ...res,
       [next.key]: get(data, 'data.components', []).filter(item => item.lineKey === next.key)
     }), {}),
     block: {},
     line: {},
   }
  }
};

