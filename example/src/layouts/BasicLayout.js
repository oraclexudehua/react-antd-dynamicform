import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Select, Input, Button, Col } from 'antd';
import DynamicForm from '@/components/Dynamic'
import axios from 'axios'

const { DynamicFormCol } = DynamicForm
export default class BasicLayout extends Component {
  state = {
    list: []
  };



  componentDidMount() {
    const _this = this
    axios.get('http://127.0.0.1:3000/getList')
      .then(function (response) {
        // handle success
        _this.setState({
          list: response.data
        })
        // console.log(response);
      })
  }

  renderOption = (record) => {

    return record.map(record => {
      return (
        <Select.Option value={record.age} >
          {record.name}
        </Select.Option>
      )
    })
  }
  render() {
    const { list } = this.state
    const value = [{ name: '12', value: 12 }, { name: '12', value: 12 }, { name: '12', value: 12 }, { name: '12', value: 12 }]
    return (
      <div>
        <Card>
          <DynamicForm
            renderButton={(callBack) => {
              return (
                <Col span={12} offset={1}>
                  <Button style={{ width: '100%' }} onClick={() => { callBack() }}>
                    添加新的对象
                  </Button>
                </Col>
              )
            }}
            value={value}
            onChange={(value) => { console.log(value) }}>
            <DynamicFormCol
              label='名称'
              field='name'
              col={{ span: 11 }}>
              <Select>
                {this.renderOption(list || [])}
              </Select>
            </DynamicFormCol>
            <DynamicFormCol
              label='标准值'
              field='value'
              col={{ span: 12, offset: 1 }}
              renderChild={(record) => {
                if (record.name == 'WCS') {
                  return (
                    <Input />
                  )
                } else {
                  return (
                    <Select>
                      <Select.Option value='WCS'>
                        WCS
                          </Select.Option>
                      <Select.Option value='WMS'>
                        WMS
                          </Select.Option>
                    </Select>
                  )
                }
              }}
            >
            </DynamicFormCol>
            <DynamicFormCol  field='id' >
              <Input hidden/>
            </DynamicFormCol>
          </DynamicForm>
        </Card>
      </div>
    );
  }
}
