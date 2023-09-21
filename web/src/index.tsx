import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

import '../styles/styles.scss'
import '../styles/react-diff-view.scss'

// const mdi = new MarkdownIt({
// linkify: true,
// highlight(code, language) {
//     const validLang = !!(language && hljs.getLanguage(language))
//     if (validLang) {
//     const lang = language ?? ''
//     return highlightBlock(hljs.highlight(lang, code, true).value, lang)
//     }
//     return highlightBlock(hljs.highlightAuto(code).value, '')
// }
// })
// mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

// function highlightBlock(str, lang) {
// return `<pre class="pre-code-box"><div class="pre-code-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><div class="pre-code"><code class="hljs code-block-body ${lang}">${str}</code></div></pre>`
// }

// const getMdiText = (value) => {
//     return mdi.render(value)
// }

// const state = reactive({
//     htmlStr: '' 
// })

document.addEventListener("DOMContentLoaded", function (event) {
    const container = document.getElementById("app");
    const root = createRoot(container);
    root.render(<App />);
});