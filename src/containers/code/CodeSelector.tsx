import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface Response{
    source_code?:string,
    response?:string
}

// export interface ResponseProps{
//     responses:Response
// }

export interface ResponseProps{
    // source_code?:string,
    response?:string
}

export const CodeSelector = (props: ResponseProps) => {
    console.log(props.response)
    // return (ReactDom.render(
    //         <Markdown
    //         children={props.response}
    //         components={{
    //             code(props) {
    //             const {children, className, inline, node, ...rest} = props
    //             const match = /output_type-(\w+)/.exec(className || '')
    //             return !inline && match ? (
    //                 <SyntaxHighlighter
    //                 {...rest}
    //                 children={String(children).replace(/\n$/, '')}
    //                 style={vs}
    //                 showLineNumbers
    //                 output_type={match[1]}
    //                 PreTag="div"
    //                 />
    //             ) : (
    //                 <code {...rest} className={className}>
    //                 {children}
    //                 </code>
    //             )
    //             }
    //         }}
    //         ></Markdown>
    // ))
    return (
        <div>
          <ReactMarkdown
            children={props.response}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    showLineNumbers={true}
                    style={vs}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>
      );
  }