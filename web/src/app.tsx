import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes,
    useMatch
} from "react-router-dom";
import { PollingMultiDiffContainer } from './containers/code/PollingMultiDiffContainer';
import { AppLayout } from './containers/common/AppLayout';
import { HomeContent } from './containers/home/Home';

export interface BaseParams {
    network?: string,
    address?: string,
    format?: string,
    language?: string,
}
// import sample from "./sample.json"


const JsonDisplay = () => {
    const [jsonData, setJsonData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // 根据参数来动态导入不同的 JSON 文件
          const jsonModule = await import(`../assets/sample.json`);
          const data = jsonModule.default; // 获取导入的 JSON 数据
          setJsonData(data);
        } catch (error) {
          console.error('Error loading JSON:', error);
        }
      };
  
      fetchData();
    });
  
    if (!jsonData) {
      return <div>Loading...</div>;
    }
  
    return (
      <div>
        <h1>JSON Data</h1>
        <ul>
          {jsonData.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default JsonDisplay;

async function initializeMultiDiff(
    params: BaseParams
) {
    const [data, setData] = useState<any[]>([]);
    const body = params
    // const fs = require('fs')
    // console.log(params)
    const response = await fetch(
        // '../assets/data/' + params.address + "/" + params.language + "/Bytecode.json" 
        "./sample.json"
    )

    useEffect(() => {
    // 使用fetch API加载本地JSON文件
    fetch('./data.json')
        .then((response) => response.json())
        .then((jsonData) => setData(jsonData))
        .catch((error) => console.error('Error loading JSON:', error));
    }, []);

    console.log(data)
    // useEffect(() => {
    //     import("../dist/sample.json")
    //         .then((response) => response.default)
    // })
    // const response = JSON.parse(fs.readFileSync("./dist/sample.json"))
    // console.log(response)
    // if (response) {
    //     const json = await response.json()
    //     if (json.status === 'ok') {
    //         //Return the whole array of found upgrades
    //         return json.data
    //     } else if (json.status === 'nok') {
    //         return Promise.reject(json.msg);
    //     }
    // }
    const msg = 'The result of the '+params.address+" is not in the examples";
    return Promise.reject(msg);
}

export const CodeRoutes = () => {
    const [error, setError] = useState(undefined);

    const baseMatch = useMatch("/reversedcode/:network/:address/:format/:language")
    const getBaseParams = () => {
        return {
            address:baseMatch.params.address,
            format:baseMatch.params.format,
            language:baseMatch.params.language
        }
    }

    const multiDiffFetch = (params: BaseParams) => {
        return initializeMultiDiff(params)
    }

    return <Routes>
        <Route path="/reversedcode/:network/:address/:format/:language" element={
            <AppLayout>
                <Layout>
                    {/* <div>
                        <p>Hello ChatGPT</p>
                    </div> */}
                    <JsonDisplay />
                    {/* <PollingMultiDiffContainer
                        getPathParams={getBaseParams}
                        diffFetchHook={multiDiffFetch}
                        error={error}
                        setError={setError}
                    /> */}
                </Layout>
            </AppLayout>
        } />
        <Route path="/*"
            element={
                <HomeContent />
            } />
    </Routes>
}

export const App = () => {
    return <Router>
        <CodeRoutes />
    </Router>
}
