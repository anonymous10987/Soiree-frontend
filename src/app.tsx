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

const DataRenderer: React.FC<BaseParams> = ({ address, format, language }) => {
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

    return <Routes>
        <Route path="/reversedcode/:network/:address/:format/:language" element={
            <AppLayout>
                <Layout>
                  <DataRenderer 
                    address={baseMatch.params.address}
                    format={baseMatch.params.format}
                    language={baseMatch.params.language} />
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
