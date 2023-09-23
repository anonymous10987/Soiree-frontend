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

interface BaseParamsProps {
  getBaseParams: (match:any) => BaseParams,
  setError: (err: string) => void
  error: string
  selectedSearchParam?: number;
}

export function DataLoader(props: BaseParamsProps) {
  const [data, setData] = useState<any>(null);
  const baseParams = props.getBaseParams(props)
  console.log(baseParams)
  useEffect(() => {
    axios.get(`http://localhost:3003/data/${baseParams.address}/${baseParams.language}/${baseParams.format}.json`)
      .then((response) => {
        console.log(response)
        setData(response.data);
      })
      .catch((error) => {
        console.error(`Error loading data for address ${baseParams.address}: ${error}`);
      });
  }, [baseParams.address]);

  return (
    <div>
      <h1>Data for Address: {baseParams.address}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
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
                  <DataLoader 
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
