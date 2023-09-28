import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes,
    useMatch
} from "react-router-dom";
import { AppLayout } from './containers/common/AppLayout';
import { HomeContent } from './containers/home/Home';
import axios from 'axios';

import ReactMarkdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dark, vs} from 'react-syntax-highlighter/dist/esm/styles/prism'
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import {InputType, InputSelector, Result} from './containers/code/InputSelector';
import { SelectorSkeleton } from './containers/code/SelectorSkeleton';

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

export function DataLoader(props: BaseParamsProps) {
  const [data, setData] = useState<any>(null);
  const baseParams = props.getBaseParams(props)
  // console.log(baseParams)
  useEffect(() => {
    axios.get(`http://localhost:3003/data/${baseParams.address}/${baseParams.output_type}/${baseParams.input_type}.json`)
      .then((response) => {
        setData(response.data["choices"][0]["message"]["content"])
      })
      .catch((error) => {
        console.error(`Error loading data for address ${baseParams.address}: ${error}`);
      });
  }, [baseParams.address]);
  
  return (
    <div>
      <h1>Data for Address: {baseParams.address}</h1>
      <ReactMarkdown
        children={data}
        components={{
          code(props) {
            const {children, className, inline, node, ...rest} = props
            const match = /output_type-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                {...rest}
                children={String(children).replace(/\n$/, '')}
                style={vs}
                showLineNumbers
                output_type={match[1]}
                PreTag="div"
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          }
        }}
      ></ReactMarkdown>
    </div>
  );
}

export function MultiInputsContainer(props: BaseParamsProps) {
  const [results, setResult] = useState<any>(null);
  const baseParams = props.getBaseParams(props);
  
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData: Result[] = [];
  
      for (const input_type of ["Bytecode", "DecompiledCode", "Description"]) {
        for (const output_type of ["Solidity", "Vyper"]) {
          try {
            const response = await axios.get(
              `http://localhost:3003/data/${baseParams.address}/${output_type}/${input_type}.json`
            );
  
            if (response.data["status"] === "1") {
              const selected =
                input_type === baseParams.input_type &&
                output_type === baseParams.output_type;
  
              fetchedData.push({
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
                Hello world
            </div>

            </Content>
      </>)  
}

export const CodeRoutes = () => {
    const [error, setError] = useState(undefined);

    const baseMatch = useMatch("/:input_type/:output_type/:address")
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
        <Route path="/:input_type/:output_type/:address" element={
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
