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
import { CodeSelector, SourceView } from './containers/code/CodeSelector';
import { InputSelector, Result } from './containers/code/InputSelector';
import { SelectorSkeleton } from './containers/code/SelectorSkeleton';

import { ErrorContent } from './components/error/ErrorContent';

export interface BaseParams {
    address?: string,
    input_type?: string,
    output_type?: string,
    model?:string,
}

interface BaseParamsProps {
  getBaseParams: (match:any) => BaseParams,
  setError: (err: string) => void
  error: string
  selectedSearchParam?: number;
}

export function MultiInputsContainer(props: BaseParamsProps) {
  // console.log("enter")
  const [results, setResult] = useState<any>(null);
  const baseParams = props.getBaseParams(props);
  
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData: Result[] = [];
      const input_types = ["Bytecode", "DecompiledCode"]
      // const output_types = ["Solidity", "Vyper"]
      const output_types = ["Solidity"]
      const models = ["ChatGPT4","ChatGPT4-32k"]
      const meta_info = await axios.get(
        `http://localhost:3003/data/meta/${baseParams.address}.json`
      );
      for (const model of models){
        for (const input_type of input_types) {
          for (const output_type of output_types) {
            try {
              const response = await axios.get(
                `http://localhost:3003/data/${model}/${baseParams.address}/${output_type}/${input_type}.json`
              );
              const selected =
                input_type === baseParams.input_type &&
                output_type === baseParams.output_type && 
                model === baseParams.model;

              if (response.data["status"] === "1") {
    
                fetchedData.push({
                  address:baseParams.address,
                  input_type: input_type,
                  output_type: output_type,
                  model:model,
                  source:meta_info.data['Source'],
                  language:meta_info.data['Language'],
                  timestamp: response.data["created"],
                  selected: selected,
                  error:"",
                  response: response.data["choices"][0]["message"]["content"],
                });
              }else{
                fetchedData.push({
                  address:baseParams.address,
                  input_type: input_type,
                  output_type: output_type,
                  model:model,
                  source:meta_info.data['Source'],
                  language:meta_info.data['Language'],
                  timestamp: response.data["created"],
                  selected: selected,
                  error: response.data["status"],
                  response:""
                })
              }
            } catch (error) {
              console.error(`Error loading data for address ${baseParams.address}: ${error}`);
            }
          }
        }  
      }
      console.log(fetchedData)
      setResult(fetchedData);
    };
    fetchData();
   }, [baseParams.address]);

  // console.log("Input types" + input_types)
  return (<>
            <Sider className='sider' style={{background: 'white'}} width={220}>
                <div className='input_selector'>
                  {
                      results?.length > 0 ?
                      <InputSelector
                        input_types={results.map((item:Result) => ({
                          address:item.address,
                          input_type:item.input_type, 
                          output_type:item.output_type, 
                          model:item.model,
                          timestamp:item.timestamp,
                          selected:item.selected
                        })) || []}
                      /> :
                      <SelectorSkeleton />
                  }
                </div>
            </Sider>
            {/* <Content style={{background: 'white'}} >
            <div className='code_viewer'>
              {
                results?.length > 0 ?
                <SourceView
                  source_code={results.filter((item) => item.input_type == baseParams.input_type && item.output_type == baseParams.output_type && item.model == baseParams.model)[0].source}
                  language={results.filter((item) => item.input_type == baseParams.input_type && item.output_type == baseParams.output_type && item.model == baseParams.model)[0].language}
                />
                :
                <ErrorContent error='not in sampling'/>
              }
            </div>
            </Content> */}
            <Content style={{background: 'white'}}>
              <div className='container'>
                <div className='source_viewer'>
                {
                  results?.length > 0 ?
                  <SourceView
                    source_code={results.filter((item) => item.input_type == baseParams.input_type && item.output_type == baseParams.output_type && item.model == baseParams.model)[0].source}
                    language={results.filter((item) => item.input_type == baseParams.input_type && item.output_type == baseParams.output_type && item.model == baseParams.model)[0].language}
                  />
                  :
                  <ErrorContent error='not in sampling'/>
                }
              </div>
              <div className='code_viewer'>
                {
                    results?.length > 0 ?
                      results.filter((item) => item.input_type == baseParams.input_type && item.output_type == baseParams.output_type && item.model == baseParams.model)[0].response?.length > 0?
                        <CodeSelector
                          response={results.filter((item) => item.input_type == baseParams.input_type && item.output_type == baseParams.output_type && item.model == baseParams.model)[0].response}
                        />
                      :
                      <ErrorContent error={results.filter((item) => item.input_type == baseParams.input_type && item.output_type == baseParams.output_type && item.model == baseParams.model)[0].error}/>
                    :
                    <ErrorContent error='not in sampling'/>
                }
              </div>
            </div>
            </Content>
      </>)  
}

export const CodeRoutes = () => {
    const [error, setError] = useState(undefined);

    const baseMatch = useMatch("/:address/:input_type/:output_type/:model")
    const getBaseParams = () => {
      return {
        address: baseMatch.params.address,
        input_type: baseMatch.params.input_type,
        output_type: baseMatch.params.output_type,
        model:baseMatch.params.model
      }
    }

    return <Routes>
        <Route path="/*"
            element={
                <HomeContent />
            } />
        <Route path="/:address/:input_type/:output_type/:model" element={
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
