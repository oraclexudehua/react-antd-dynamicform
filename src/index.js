import React, { Component } from 'react'
import { Form, Col, Row, Button } from 'antd'

@Form.create({
  onValuesChange(props, _, allValues) {
    const resultValue = []
    const resultKey = Object.keys(allValues)
    if (allValues[resultKey[0]] != null) {
      for (let index = 0; index < allValues[resultKey[0]].length; index += 1) {
        const o = {}
        for (let n = 0; n < resultKey.length; n += 1) {
          const a = resultKey[n];
          o[a] = allValues[a][index]
        }
        resultValue.push(o)
      }
    }
    if (props.onChange) {
      props.onChange(resultValue || {})
    }
  }
})
export default  class DynamicForm extends Component {
  state = {
    result: {
      keys: []
    },
    fields: [

    ]
  }

  UNSAFE_componentWillMount() {
    this.init()
  }

  componentDidMount() {
    const { value } = this.props
    if (value != null) {
      const newValue = this.transForm(value)
      this.setState({
        result: newValue
      })
    }
  }

  init = () => {
    const { children } = this.props
    // console.log(children.constructor)
    if (Array.isArray(children)) {
      const result = []
      for (let index = 0; index < children.length; index += 1) {
        const element = children[index];

        const { props: { field } } = element
        result.push(
          field
        )
      }
      this.setState({
        fields: result
      })
    } else {
      const { props: { field } } = children
      this.setState({
        fields: [field]
      })
    }
  }

  transForm = value => {
    const result = { keys: [] }
    const { fields } = this.state
    for (let j = 0; j < fields.length; j += 1) {
      const obj = fields[j];
      result[obj] = []
    }
    for (let index = 0; index < value.length; index += 1) {
      const element = value[index];
      const keys = Object.keys(result)
      for (let j = 0; j < keys.length; j += 1) {
        const key = keys[index];
        result[key].push(element[key])
      }
      result.keys.push(index)
    }
    return result
  }

  add = () => {
    const { result } = this.state
    const { keys } = result
    this.setState({
      result: {
        ...result,
        keys: [...keys, keys[0] != null ? keys[keys.length - 1] + 1 : 0]
      }
    })
  }

  delete = k => {
    const { result } = this.state
    const { keys } = result
    this.setState({
      result: {
        ...result,
        keys: keys.filter(record => {
          return record !== k
        })
      }
    })
  }

  dealValue = () => {
    const { form: { getFieldsValue } } = this.props
    const value = getFieldsValue()
  }

  generateValue = (value, k) => {
    const result = {}
    const keys = Object.keys(value)
    for (let index = 0; index < keys.length; index += 1) {
      const key = keys[index];
      result[key] = value[key][k]
    }
    return result
  }

  renderNode = (records, k) => {
    const result = []
    const { result: stateResult } = this.state
    const { form: { getFieldDecorator, getFieldsValue } } = this.props
    if (Array.isArray(records)) {
      for (let index = 0; index < records.length; index += 1) {
        const element = records[index];
        const { props: { col, renderChild, children, field } } = element
        let newChild = children
        if (renderChild) {
          newChild = renderChild(this.generateValue(getFieldsValue(), k))
        }
        result.push(
          <Col {...col}>
            <Form.Item
              required={false}
            >
              {getFieldDecorator(`${field}[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: stateResult[`${field}`] ? stateResult[`${field}`][k] : null,
              })(newChild)}
            </Form.Item>
          </Col>
        )
      }
    } else {
      // const element = records[index];
      const { props: { col, renderChild, children, field } } = records
      let newChild = children
      if (renderChild) {
        newChild = renderChild(this.generateValue(getFieldsValue(), k))
      }
      result.push(
        <Col  {...col}>
          <Form.Item
            required={false}
          >
            {getFieldDecorator(`${field}[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: stateResult[`${field}`] ? stateResult[`${field}`][k] : null,
            })(newChild)}
          </Form.Item>
        </Col>
      )
    }

    return result
  }

  render() {
    const { result } = this.state
    const { keys } = result
    const { children } = this.props

    const formItems = keys.map(k => (
      <Col key={k}>
        <Col span={22}>
          {this.renderNode(children, k)}
        </Col>
        <Col span={2}>
          <Button type="danger" icon="delete" onClick={() => { this.delete(k) }}>
          </Button>
        </Col>
      </Col>
    ))
    return (
      <div>

        <Row>
          <Form>
            {formItems}
          </Form>
        </Row>
        <Row>
          <Button
            style={{ width: '100%' }}
            type="dashed"
            onClick={() => { this.add() }}
          >
            添加
          </Button>
        </Row>
      </div>
    )
  }
}

export class DynamicFormCol extends Component {
  state = {

  }

  render() {
    const { children } = this.props
    return (
      <span>
        {children}
      </span>
    )
  }
}