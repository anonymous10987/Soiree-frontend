import { Layout } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useMatch
} from "react-router-dom";
import { AppLayout } from './containers/common/AppLayout';
import { HomeContent } from './containers/home/Home';

import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { CodeSelector } from './containers/code/CodeSelector';
import { InputSelector, Result } from './containers/code/InputSelector';
import { SelectorSkeleton } from './containers/code/SelectorSkeleton';

import { ErrorContent } from './components/error/ErrorContent';


export interface BaseParams {
    address?: string,
    input_type?: string,
    output_type?: string,
}

export interface ContractMeta {
    address?: string,
    output_type?: string,
    source?: string,
}

interface BaseParamsProps {
  getBaseParams: (match:any) => BaseParams,
  setError: (err: string) => void
  error: string
  selectedSearchParam?: number;
}

export function MultiInputsContainer(props: BaseParamsProps) {
  console.log("enter")
  const [results, setResult] = useState<any>(null);
  const baseParams = props.getBaseParams(props);
  
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData: Result[] = [];
      const input_types = ["Bytecode", "DecompiledCode", "Description"]
      // const output_types = ["Solidity", "Vyper"]
      const output_types = ["Solidity"]
      for (const input_type of input_types) {
        for (const output_type of output_types) {
          try {
            const response = await axios.get(
              `http://localhost:3003/data/${baseParams.address}/${output_type}/${input_type}.json`
            );
  
            if (response.data["status"] === "1") {
              const selected =
                input_type === baseParams.input_type &&
                output_type === baseParams.output_type;
  
              fetchedData.push({
                address:baseParams.address,
                input_type: input_type,
                output_type: output_type,
                timestamp: response.data["created"],
                selected: selected,
                response: response.data["choices"][0]["message"]["content"],
              });
            }
          } catch (error) {
            console.error(`Error loading data for address ${baseParams.address}: ${error}`);
          }
        }
      }
  
      setResult(fetchedData);
    };
    fetchData();
   }, [baseParams.address]);

  // console.log("Input types" + input_types)
  return (<><Sider className='sider' style={{
                background: 'white'
            }}
                width={220}>
                <div className='input_selector'>
                  {
                      results?.length > 0 ?
                      <InputSelector
                        input_types={results.map((item:Result) => ({
                          address:item.address,
                          input_type:item.input_type, 
                          output_type:item.output_type, 
                          timestamp:item.timestamp,
                          selected:item.selected
                        })) || []}
                      /> :
                      <SelectorSkeleton />
                  }
                </div>
            </Sider>
            <Content style={{
                background: 'white'
            }}>
            <div className='code_viewer'>
              {
                results?.length > 0 ?
                <CodeSelector
                  response={results.filter((item) => item.input_type == baseParams.input_type && item.output_type == baseParams.output_type)[0].response}
                />
                :
                <ErrorContent error='not in sampling'/>
              }
            </div>

            </Content>
      </>)  
}

export const CodeRoutes = () => {
    const [error, setError] = useState(undefined);

    const baseMatch = useMatch("/:address/:input_type/:output_type")
    const getBaseParams = () => {
      return {
        address: baseMatch.params.address,
        input_type: baseMatch.params.input_type,
        output_type: baseMatch.params.output_type
      }
    }

    return <Routes>
        <Route path="/*"
            element={
                <HomeContent />
            } />
        <Route path="/:address/:input_type/:output_type" element={
            <AppLayout>
                <Layout>
                  <MultiInputsContainer
                  getBaseParams = {getBaseParams}
                  error={error}
                  setError={setError} />
                </Layout>
            </AppLayout>
        } />
    </Routes>
}

export const App = () => {
    return <Router>
        <CodeRoutes />
    </Router>
}
