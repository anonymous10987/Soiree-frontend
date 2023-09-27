import React, { HTMLProps, useEffect } from 'react'
import { Radio, RadioChangeEvent, Space } from "antd"

interface InputType {
    input:string
}

interface InputSelectorProps {
    inputs: InputType[];
    setSelectedDiff: (upgrade: InputType) => void;
}

export const getOptionCard = (upgrade: InputType) => {
    if (upgrade.verified) {
        return <DiffOptionCard upgrade={upgrade} />
    } else {
        return <DisabledOptionCard upgrade={upgrade} />
    }
}

export const InputSelector = (props: InputSelectorProps & HTMLProps<void>) => {
    let [searchParams, setSearchParams] = useSearchParams();

    let inputs = props.inputs;

    const inputsIndex = inputs.reduce((ind, u, i) => {
        ind[getKey(u)] = [u, i]
        return ind;
    }, {})

    const setNewValue = (e: RadioChangeEvent) => {
        const id = e.target.value;
        const [upgrade, index] = inputsIndex[id];
        props.setSelectedDiff(upgrade);
        searchParams.set('selected', (inputs.length - index).toString())
        setSearchParams(searchParams);
    }

    let selectedSearchParam = undefined
    try {
        selectedSearchParam = parseInt(searchParams.get('selected'))
    } catch (e) { }

    let _selected = selectedSearchParam >= inputs.length ? 0 : inputs.length - selectedSearchParam
    if (!selectedSearchParam) {
        _selected = 0;
    }

    useEffect(() => {
        if (selectedSearchParam)
            props.setSelectedDiff(inputs[inputs.length - selectedSearchParam]);
    })

    const _selectedKey = getKey(inputs[_selected]);
    return <Radio.Group defaultValue={_selectedKey} buttonStyle="solid" onChange={setNewValue}>
        <Space direction="vertical">
            {
                inputs.map(u => {
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