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
import axios from 'axios';

export interface BaseParams {
    network?: string,
    address?: string,
    format?: string,
    language?: string,
}

interface PollingMultiDiffContainerProps {
    getPathParams: (match: any) => BaseParams
    setError: (err: string) => void
    error: string
    selectedSearchParam?: number;
}

// const JsonDisplay = (props: PollingMultiDiffContainerProps) => {
//     const [jsonData, setJsonData] = useState(null);
//     const params = props.getPathParams(props);
//     console.log(params)
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           // 根据参数来动态导入不同的 JSON 文件
//         //   const file_path = `./web/assets/data/${params.address}/Solidity/Bytecode.json`
//           // const file_path = "../assets/sample.json"
//           // console.log(file_path)
//           // const jsonModule = await import(`${file_path}`);
//           // const jsonModule = await import("../public/sample.json")
//           // const jsonModule = await import(`../public/data/${params.address}/Solidity/Bytecode.json`)
//           // const dynamicPath = `../public/data/${params.address}/Solidity/Bytecode.json`
//           // console.log(dynamicPath)
//           // ../public/data/0x0b76544f6c413a555f309bf76260d1e02377c02a/Solidity/Bytecode.json
//           // const jsonModule = await import("../public/data/0x0b76544f6c413a555f309bf76260d1e02377c02a/Solidity/Bytecode.json")
//           // const jsonModule = await import(dynamicPath)
//           const dynamicPath = `../public/data/${params.address}/Solidity/Bytecode.json`;
//           console.log('Dynamic Path:', dynamicPath);
//           const jsonModule = await import(dynamicPath);
//           const data = jsonModule.default; // 获取导入的 JSON 数据
//           setJsonData(data);
//         } catch (error) {
//           console.error('Error loading JSON:', error);
//         }
//       };
  
//       fetchData();
//     });
//     console.log(jsonData)
  
//     if (!jsonData) {
//       return <div>Loading...</div>;
//     }
//     return (
//       <div>
//         {jsonData['ir']}
//         {/* <h1>JSON Data</h1>
//         <ul>
//           {jsonData.map((item) => (
//             <li key={item.id}>{item.name}</li>
//           ))}
//         </ul> */}
//       </div>
//     );
//   };


// const JsonDisplay = (file_url: string) => {
//     const [jsonData, setJsonData] = useState(null);
//     // const params = props.getPathParams(props);
//     // console.log(params)
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           // 根据参数来动态导入不同的 JSON 文件
//         //   const file_path = `./web/assets/data/${params.address}/Solidity/Bytecode.json`
//           // const file_path = "../assets/sample.json"
//           // console.log(file_path)
//           // const jsonModule = await import(`${file_path}`);
//           // const jsonModule = await import("../public/sample.json")
//           // const jsonModule = await import(`../public/data/${params.address}/Solidity/Bytecode.json`)
//           // const dynamicPath = `../public/data/${params.address}/Solidity/Bytecode.json`
//           // console.log(dynamicPath)
//           // ../public/data/0x0b76544f6c413a555f309bf76260d1e02377c02a/Solidity/Bytecode.json
//           // const jsonModule = await import("../public/data/0x0b76544f6c413a555f309bf76260d1e02377c02a/Solidity/Bytecode.json")
//           // const jsonModule = await import(dynamicPath)
//           // const dynamicPath = `../public/data/${params.address}/Solidity/Bytecode.json`;
//           // console.log('Dynamic Path:', dynamicPath);
//           console.log(file_url)
//           const jsonModule = await import(`${file_url}`);
//           const data = jsonModule.default; // 获取导入的 JSON 数据
//           setJsonData(data);
//         } catch (error) {
//           console.error('Error loading JSON:', error);
//         }
//       };
  
//       fetchData();
//     });
//     console.log(jsonData)
  
//     if (!jsonData) {
//       return <div>Loading...</div>;
//     }
//     return (
//       <div>
//         {jsonData['ir']}
//         {/* <h1>JSON Data</h1>
//         <ul>
//           {jsonData.map((item) => (
//             <li key={item.id}>{item.name}</li>
//           ))}
//         </ul> */}
//       </div>
//     );
//   };

interface DataRendererProps {
  address: string;
}

const DataRenderer: React.FC<DataRendererProps> = ({ address }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // axios.get(`/public/data/${address}/Solidity/Bytecode.json`)
    axios.get(`http://localhost:3003/data/${address}/Solidity/Bytecode.json`)
      .then((response) => {
        console.log(response)
        setData(response.data);
      })
      .catch((error) => {
        console.error(`Error loading data for address ${address}: ${error}`);
      });
  }, [address]);

  return (
    <div>
      <h1>Data for Address: {address}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default DataRenderer;

// export default JsonDisplay;

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

    // const jsondisplay = JsonDisplay("../public/data/0x0b76544f6c413a555f309bf76260d1e02377c02a/Solidity/Bytecode.json")
    // const jsondisplay = DataRenderer("0x0b76544f6c413a555f309bf76260d1e02377c02a")

    return <Routes>
        <Route path="/reversedcode/:network/:address/:format/:language" element={
            <AppLayout>
                <Layout>
                  {/* {jsondisplay} */}
                  <DataRenderer address='0x0b76544f6c413a555f309bf76260d1e02377c02a' />
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
