import { client, formPath } from 'client/request';
import { message } from 'antd';
import { forms, json_template } from 'client/api';
import { convert } from './nomarlize';
import { combineFields } from './constants';
import { get } from 'lodash';

export default {
  state: {
    loading: false,
    id: '',
    props: {
      value: '',
      name: '',
      api: '',
      fontSize: '3',
    },
    lines: [],
    components: [],
    chunkComponent: {},
    block: {},
    line: {},
    component: {},
    fields: [],
    inputList: [],
    type: ''
  }, // initial state
  reducers: {
    // handle state changes with pure functions
    setLoading(state, loading) {
      return {...state, loading};
    },
    initForm(state, payload) {
      return {...state, ...payload};
    },
    initLines(state, payload) {
      return {...state, lines: payload};
    },
    initComponents(state, payload) {
      return {...state, components: payload};
    },
    initFields(state, payload) {
      return { ...state, fields: payload };
    },
    updateFormProps(state, payload) {
      return {
        ...state,
        props: {
          ...payload
        }
      }
    },
    
    // manage lines
    updateLine(state, payload) {
      const newLines = state.lines.map(line => line.key === payload.key ? payload : line);
      return { ...state, lines: newLines };
    },
    addLine(state, payload) {
      return { ...state, lines: [...state.lines, payload] }
    },
    removeLine(state, payload) {
      return {
        ...state,
        lines: state.lines.filter(item => item.key !== payload.key),
        line: {},
        block: {},
        components: state.components.filter(item => item.parent !== payload.key)
      }
    },
    
    // manage components
    updateComponents(state, payload) {
      const newItems = state.components.map(item => item.key === payload.key ? payload : item);
      return { ...state, components: newItems };
    },
    addComponent(state, payload) {
      return { ...state, components: [...state.components, payload] }
    },
    addTypeComponent( state, payload) {
      return { ...state, type:  payload}
    },
    removeComponent(state, payload) {
      return {
        ...state,
        components: state.components.filter(item => item.key !== payload.key),
        block: {},
        component: {},
      }
    },
    pasteLayout(state, payload) {
      return { ...state, ...payload };
    },
    focusLine(state, payload) {
      return { ...state, line: payload };
    },
    focusBlock(state, payload) {
      return { ...state, block: payload }
    },
    focusComponent(state, payload) {
      return { ...state, component: payload }
    }
  },
  effects: dispatch => ({
    async updateForm(payload, rootState) {
      const { config } = rootState;
      const { id, properties } = payload;
      
      if (id) {
        const data = {
          id: payload.id,
          value: config.props.value,
          name: config.props.name,
          api: config.props.api,
          layout: payload.lines,
          components: payload.components.filter(item => !!item).map(item => {
            const props = properties.key === item.key ? properties : item.props;
            
            return {
              ...item,
              value: item.value,
              content: '',
              props: {
                ...item.props,
                ...props,
                checkList: item.props && item.props.checkList ?
                  item.props.checkList.map(check => {
                    const list = props.checkList || [];
                    const obj = list.find(i => i.key === check.key) || {};
                    return { ...check, label: check && check.labelValue, value: obj.value || '' }
                  }) : [],
              }
            }
          }),
          config: {
            fontSize: config.props.fontSize || '3',
          }
        };
  
        const response = await client.put(`${formPath}${forms}/${id}`, data).then(res => res.data);
        dispatch.config.initForm(convert(response));
        message.success('Form update success!');
      }
    },
    
    async createNewForm(payload) {
      const data = {
        value: payload.value,
        name: payload.name,
        api: payload.api,
        layout: [],
        components: [],
        config: {
          fontSize: '3'
        }
      };
      
      const response = await client.post(`${formPath}${forms}`, data).then(res => res.data);
      dispatch.config.initForm(convert(response));
      dispatch.listing.addNew(response.data);
      message.success('Form create success!');
    },

    async getFields(payload) {

      const response = await client.get(`${formPath}${payload}${json_template}`).then(res => res.data.data);
      if (response) {
        const fields = combineFields(response, []);
        dispatch.config.initFields(Object.keys(fields));
      }
    },
    
    async getById(payload, rootState) {
      dispatch.config.setLoading(true);
      const response = await client.get(`${formPath}${forms}/${payload || ''}`).then(res => res.data);
      const data = convert(response);
      dispatch.config.getFields(get(data, 'props.api', ''));
      await dispatch.config.initForm(data);
      dispatch.config.setLoading(false);
    },
  })
}
