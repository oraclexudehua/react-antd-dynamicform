import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Select, Input } from 'antd';
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
    debugger
    return (
      <div>
        <Card>
          <DynamicForm>
            <DynamicFormCol
              field='name'
              col={{ span: 10 }}>
              <Select>
                {this.renderOption(list||[])}
              </Select>
            </DynamicFormCol>
            <DynamicFormCol
              field='value'
              col={{ span: 10, offset: 1 }}
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
          </DynamicForm>
        </Card>
      </div>
    );
  }
}
