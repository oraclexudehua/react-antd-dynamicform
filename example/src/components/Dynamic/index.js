import React, { Component } from 'react';
import { Form, Col, Row, Button } from 'antd';


@Form.create({
  onValuesChange(props, _, allValues) {
    const resultValue = [];
    const resultKey = Object.keys(allValues);
    const keys = allValues.keys
    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      const o = {};
      for (let n = 0; n < resultKey.length; n += 1) {
        const a = resultKey[n];
        if (a != 'keys') {
          o[a] = allValues[a][element];
        }
      }
      resultValue.push(o);
    }
    if (props.onChange) {
      props.onChange(resultValue || {});
    }
  },
})
export default class DynamicForm extends Component {
  state = {
    result: {
      keys: [],
    },
    fields: [],
    id: 0
  };

  UNSAFE_componentWillMount() {
    this.init();
  }

  componentDidMount() {
    const { value } = this.props;
    if (value != null) {
      const newValue = this.transForm(value);
      this.setState({
        id: value.length || 0,
        result: newValue,
      });
    }
  }

  init = () => {
    const { children } = this.props;
    // console.log(children.constructor)
    if (Array.isArray(children)) {
      const result = [];
      for (let index = 0; index < children.length; index += 1) {
        const element = children[index];
        const {
          props: { field },
        } = element;
        result.push(field);
      }
      this.setState({
        fields: result,
      });
    } else {
      const {
        props: { field },
      } = children;
      this.setState({
        fields: [field],
      });
    }
  };

  transForm = value => {
    const result = {};
    const { fields } = this.state;
    for (let j = 0; j < fields.length; j += 1) {
      const obj = fields[j];
      result[obj] = [];
    }
    const resultKeys = []
    for (let index = 0; index < value.length; index += 1) {
      const element = value[index];
      const keys = Object.keys(result);
      for (let j = 0; j < keys.length; j += 1) {
        const key = keys[j];
        result[key].push(element[key]);
      }
      resultKeys.push(index);
    }
    result.keys = resultKeys
    return result;
  };

  add = () => {
    const { form } = this.props;
    const { id } = this.state
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id + 1);
    this.setState({
      id: id + 1
    })
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  delete = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });

  };

  dealValue = () => {
    const {
      form: { getFieldsValue },
    } = this.props;
    const value = getFieldsValue();
  };

  generateValue = (value, k) => {
    const result = {};
    const keys = Object.keys(value);
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      result[key] = value[key][k];
    }
    return result;
  };




  generateChild = (props, k) => {
    const { result: stateResult } = this.state;
    const {
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const { col, renderChild, children, field, label } = props
    let newChild = children;
    if (renderChild) {
      newChild = renderChild(this.generateValue(getFieldsValue(), k));
    }
    console.log(props)
    const { props: { hidden } } = newChild
    if (hidden) {
      return (
        <span>
          {getFieldDecorator(`${field}[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: stateResult[`${field}`] ? stateResult[`${field}`][k] : null,
          })(newChild)}
        </span>
      );
    } else {

      return (
        <Col {...col}>
          <Form.Item required={false} label={label && k == 0 ? label : null} >
            {getFieldDecorator(`${field}[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: stateResult[`${field}`] ? stateResult[`${field}`][k] : null,
            })(newChild)}
          </Form.Item>
        </Col>
      );
    }
  }

  renderNode = (records, k) => {
    const result = [];
    const { result: stateResult } = this.state;
    const {
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    if (Array.isArray(records)) {
      for (let index = 0; index < records.length; index += 1) {
        const element = records[index];
        result.push(this.generateChild(element.props, k))
      }
    } else {
      result.push(this.generateChild(records.props, k))
    }

    return result;
  };

  renderLabel = () => {
    const { isRenderLabel } = this.props
    if (isRenderLabel) {
      const { children } = this.props


    }
    return null
  }


  render() {
    const { renderButton } = this.props
    const { result } = this.state;
    const { children, form: { getFieldDecorator, getFieldValue } } = this.props;
    getFieldDecorator('keys', { initialValue: result.keys || [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map(k => (
      <Col key={k}>
        <Col span={22}>{this.renderNode(children, k)}</Col>
        <Col span={2}>
          <Button
            type="danger"
            icon="delete"
            onClick={() => {
              this.delete(k);
            }}
          />
        </Col>
      </Col>
    ));
    return (
      <div>
        <Row>
          {this.renderLabel()}
        </Row>
        <Row>
          <Form
          layout='horizontal'
          >{formItems}</Form>
        </Row>
        <Row>
          {
            renderButton ?
              renderButton(() => {
                this.add()
              })
              :
              <Button
                style={{ width: '100%' }}
                type="dashed"
                onClick={() => {
                  this.add();
                }}
              >
                添加
          </Button>
          }

        </Row>
      </div>
    );
  }
}

export class DynamicFormCol extends Component {
  state = {};

  render() {
    const { children } = this.props;
    return <span>{children}</span>;
  }
}
