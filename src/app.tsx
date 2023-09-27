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


import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import hljs from 'highlight.js';

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

const mdi = new MarkdownIt({
  linkify: true,
  highlight(code, language) {
      const validLang = !!(language && hljs.getLanguage(language))
      if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(lang, code, true).value, lang)
      }
      return highlightBlock(hljs.highlightAuto(code).value, '')
  }
})
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

function highlightBlock(str, lang) {
  return `<pre class="pre-code-box"><div class="pre-code-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><div class="pre-code"><code class="hljs code-block-body ${lang}">${str}</code></div></pre>`
}

const getMdiText = (value) => {
    return mdi.render(value)
}

export function DataLoader(props: BaseParamsProps) {
  const [data, setData] = useState<any>(null);
  const baseParams = props.getBaseParams(props)
  console.log(baseParams)
  useEffect(() => {
    axios.get(`http://localhost:3003/data/${baseParams.address}/${baseParams.language}/${baseParams.format}.json`)
      .then((response) => {
        // console.log(response)
        setData(response.data);
      })
      .catch((error) => {
        console.error(`Error loading data for address ${baseParams.address}: ${error}`);
      });
  }, [baseParams.address]);
  // console.log("the loaded data is" + data)
  // const jsonResponse = JSON.stringify(data, null, 2)
  // console.log(jsonResponse)
  console.log(data.json())
  // console.log(data["choices"][0]["message"]["content"])
  return (
    <div>
      <h1>Data for Address: {baseParams.address}</h1>
      {/* <pre>{jsonResponse}</pre> */}
      {/* <pre className="pre-code-box"><div className="pre-code-header"><span className="code-block-header__lang">Solidity</span><span className="code-block-header__copy">copy code</span></div><div className="pre-code"><code className="hljs code-block-body ${lang}">${jsonResponse["choices"][0]["message"]["content"]}</code></div></pre> */}
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
