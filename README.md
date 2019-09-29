##这是基于antpro form组件二次提供的动态form组件
（尝试学习组件封装，组件打包功能框架是根据https://github.com/ant-design/ant-design-pro-layout修改的）


Example:
import DynamicForm from 'react-antd-dynamicfor'

const { DynamicFormCol } = DynamicForm

 <DynamicForm>
            <DynamicFormCol
              field='value'  //字段名称
              col={{ span: 10, offset: 1 }}  //col样式
              renderChild={(record) => {     //指定额外的渲染形式，实现动态表单的联动功能
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
            <DynamicFormCol
                    field='name'
                    col={{ span: 10 }}>
                    <Select>
                      <Select.Option value='WCS'>
                        WCS
                          </Select.Option>
                      <Select.Option value='WMS'>
                        WMS
                          </Select.Option>
                    </Select>
           </DynamicFormCol>
</DynamicForm>
       