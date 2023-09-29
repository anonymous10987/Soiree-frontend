import { Button, Col, Form, Input, Select, Row } from "antd";
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppLayout } from '../common/AppLayout';
import contracts from "../../../public/contracts.json"

export const HomeContent = () => {
  const [redirectUrl, setRedirectUrl] = useState(undefined)
  const onFinish = (val: any) => {
    const url = `/${val.address}/${val.input_type}/${val.output_type}`
    setRedirectUrl(url)
  }

  // console.log(contracts)
  if (!redirectUrl) {
    return <AppLayout>
      <div className='home_content'>
        <Col offset={8} span={8} >
          <Form className="home_form"
            name="form_item_path"
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              'input_type': 'DecompiledCode',
              'output_type': 'Solidity',
              'address': '0x0b76544f6c413a555f309bf76260d1e02377c02a',
            }}>
            {/* <Form.Item name="network" label="Network">
              <Select
                options={[
                  { value: 'ethereum', label: 'Ethereum' },
                  { value: 'bscscan', label: 'BSC' },
                  { value: 'ftmscan', label: 'Fantom' },
                  { value: 'polygonscan', label: 'Polygon' },
                  { value: 'arbiscan', label: 'Arbitrum' },
                  { value: 'snowtrace', label: 'Avalanche' },
                  { value: 'cronoscan', label: 'Cronos' },
                  { value: 'moonbeam', label: 'Moonbeam' },
                  { value: 'optimistic.etherscan', label: 'Optimism' },
                ]}
              />
            </Form.Item> */}
            <Form.Item name="input_type" label="Input Format">
              <Select
                options={[
                  {value: "Bytecode", label:'Bytecode'},
                  {value: "DecompiledCode", label:'DecompiledCode'},
                  {value: "Description", label:'Description'}                  
                ]}
              />
            </Form.Item>
            <Form.Item name="output_type" label="Transformed Language">
              <Select
                options={[
                  {value: "Solidity", label:'Solidity'},
                  {value: "Vyper", label:'Vyper'}
                ]}
              />
            </Form.Item>
            {/* <Form.Item name="address" label="Contract address">
              <Input placeholder={'Address of a proxy'} />
            </Form.Item> */}
            <Form.Item name="address" label="Contract address">
              <Select
                options={contracts.map((value, index) => ({
                  value: value,
                  label: `${index + 1}-${value}`,
                }))}
              />
            </Form.Item>
            <Row justify="center">
              <Col span={5}>
                <Button type="primary" htmlType="submit">
                  Go
                </Button>
              </Col>
              <Col span={5}>
                <Button type="primary" htmlType="submit">
                  Random
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </div>
    </AppLayout>
  } else {
    return <Navigate replace to={redirectUrl} />
  }
}