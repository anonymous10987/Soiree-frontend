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
import {InputType, InputSelector} from './containers/code/InputSelector';
import { SelectorSkeleton } from './containers/code/SelectorSkeleton';

export interface BaseParams {
    network?: string,
    address?: string,
    format?: string,
    language?: string,
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
    axios.get(`http://localhost:3003/data/${baseParams.address}/${baseParams.language}/${baseParams.format}.json`)
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
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                {...rest}
                children={String(children).replace(/\n$/, '')}
                style={vs}
                showLineNumbers
                language={match[1]}
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

export function formatInputTypes(input_types: InputType[]) {
  input_types = input_types.sort((a, b) => {
      if (a.input_type < b.input_type)
          return 1;
      else if (a.input_type > b.input_type)
          return -1;
      else return 0;
  })
  return input_types;
}

export function MultiInputsContainer(props) {

  let input_types = formatInputTypes(props.data?.input_types || [])

  return (<><Sider className='sider' style={{
                background: 'white'
            }}
                width={220}>
                <div className='input_selector'>
                  {
                      input_types?.length > 0 ?
                      <InputSelector
                          input_types={input_types || []}
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

    const baseMatch = useMatch("/:format/:language/:address")
    const getBaseParams = () => {
      return {
        address: baseMatch.params.address,
        format: baseMatch.params.format,
        language: baseMatch.params.language
      }
    }

    return <Routes>
        <Route path="/*"
            element={
                <HomeContent />
            } />
        <Route path="/:format/:language/:address" element={
            <AppLayout>
                <Layout>
                  <MultiInputsContainer>
                    
                  </MultiInputsContainer>
                  {/* <DataLoader 
                    getBaseParams = {getBaseParams}
                    error={error}
                    setError={setError} /> */}
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
