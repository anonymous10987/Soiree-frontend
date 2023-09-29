import { Radio, RadioChangeEvent, Row, Space, Tag } from "antd";
import React from 'react';
import { useNavigate } from 'react-router-dom';

export type UnavailableReason = 'TOKEN_LENGTH_EXCEEDED' | 'CODE_UNAVAILABLE' ;

export interface InputType {
    address?:string,
    input_type:string,
    output_type?:string,
    timestamp?:number,
    selected?:boolean,
    unavailable_reason?: UnavailableReason
}

export interface LeftSide {
    total_data,
    selected_input_type?:string,
    selected_output_type?:string
}

export interface Result {
    address:string,
    input_type:string,
    output_type:string,
    timestamp?:number,
    selected?:boolean,
    response?:string
}

export interface InputTypePros {
    input_types: InputType[]
}

export interface ResultProps {
    results: Result[]
}

function formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return dateString;
}

function renderTag(input_type: InputType) {
    if (!input_type.unavailable_reason) {
        return <Tag color="gold">Unavailable</Tag>
    } else if (input_type.unavailable_reason === 'TOKEN_LENGTH_EXCEEDED') {
        return <Tag color="gold">Token length exceeded</Tag>
    } else if (input_type.unavailable_reason === 'CODE_UNAVAILABLE') {
        return <Tag color="gold">Input unavailable</Tag>
    }
}

export const getKey = (u: InputType) => {
    return `${u.address}_${u.input_type}_${u.output_type}`;
}

export interface DisabledOptionCardProps {
    input_type: InputType
}

export const DisabledOptionCard = (props: DisabledOptionCardProps) => {
    // console.log("DisabledOptionCard" + props)
    return <>
        <Row>
            <div className='input_selector_date'>
                {
                    // formatDate(props.input_type.input_type)
                }
            </div>
        </Row>
        <Row>
            {
                renderTag(props.input_type)
            }
        </Row>
    </>
}
export interface InputCardProps {
    input_type: InputType
}

export const InputTypeCard = (props: InputCardProps) => {
    return <>
        <Row>
            <div className='input_selector_date'>
                {
                    formatDate(props.input_type.timestamp)
                }
            </div>
        </Row>
        <Row>
            <Tag color="green">{props.input_type.input_type}</Tag>
            <Tag color="orange">{props.input_type.output_type}</Tag>
        </Row>
    </>
}

export const getOptionCard = (input_type: InputType) => {
    if (!input_type.unavailable_reason) {
        return <InputTypeCard input_type={input_type} />
    } else {
        return <DisabledOptionCard input_type={input_type} />
    }
}

export const InputSelector = (prop:InputTypePros) => {
    const navigate = useNavigate()

    let input_types = prop.input_types
    const setNewValue = (e: RadioChangeEvent) => {
        const values = e.target.value.split("_")
        
        navigate(`/${values[0]}/${values[1]}/${values[2]}`)

    }
    let _selected = 0
    const _selectedKey = getKey(input_types[_selected]);
    return <Radio.Group defaultValue={_selectedKey} buttonStyle="solid" onChange={setNewValue}>
        <Space direction="vertical">
            {
                input_types.map(u => {
                    return <Radio.Button
                        value={getKey(u)}
                        id={getKey(u)}
                        key={getKey(u)}
                        className='input_selector_option'
                    >
                        {getOptionCard(u)}
                    </Radio.Button>
                })
            }
        </Space>
    </Radio.Group>
}