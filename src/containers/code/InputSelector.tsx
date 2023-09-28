import { Radio, RadioChangeEvent, Row, Space, Tag } from "antd";
import React, { HTMLProps, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type UnavailableReason = 'TOKEN_LENGTH_EXCEEDED' | 'CODE_UNAVAILABLE' ;
export interface InputType {
    input_type:string,
    unavailable_reason?: UnavailableReason
}

interface InputSelectorProps {
    input_types: InputType[];
    // setSelectedDiff: (input_type: InputType) => void;
}
const formatDate = (ts: string) => {
    const m = new Date(parseInt(ts));
    return `${m.toDateString()} ${m.toLocaleTimeString()}`
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
    return `${u.input_type.toLowerCase()}`;
}

export interface DisabledOptionCardProps {
    input_type: InputType
}

export const DisabledOptionCard = (props: DisabledOptionCardProps) => {
    return <>
        <Row>
            <div className='upgrade_selector_date'>
                {
                    formatDate(props.input_type.input_type)
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

export const getOptionCard = (input_type: InputType) => {
    return <DisabledOptionCard input_type={input_type} />
}

export const InputSelector = (props: InputSelectorProps & HTMLProps<void>) => {
    let [searchParams, setSearchParams] = useSearchParams();
    
    console.log(props)
    let input_types = props.input_types;

    const inputsIndex = input_types.reduce((ind, u, i) => {
        ind[getKey(u)] = [u, i]
        return ind;
    }, {})

    // const setNewValue = (e: RadioChangeEvent) => {
    //     const id = e.target.value;
    //     const [input_type, index] = inputsIndex[id];
    //     props.setSelectedDiff(input_type);
    //     searchParams.set('selected', (input_types.length - index).toString())
    //     setSearchParams(searchParams);
    // }

    let selectedSearchParam = undefined
    try {
        selectedSearchParam = parseInt(searchParams.get('selected'))
    } catch (e) { }

    let _selected = selectedSearchParam >= input_types.length ? 0 : input_types.length - selectedSearchParam
    if (!selectedSearchParam) {
        _selected = 0;
    }

    // useEffect(() => {
    //     if (selectedSearchParam)
    //         props.setSelectedDiff(input_types[input_types.length - selectedSearchParam]);
    // })

    const _selectedKey = getKey(input_types[_selected]);
    // return <Radio.Group defaultValue={_selectedKey} buttonStyle="solid" onChange={setNewValue}>
    return <Radio.Group defaultValue={_selectedKey} buttonStyle="solid">
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