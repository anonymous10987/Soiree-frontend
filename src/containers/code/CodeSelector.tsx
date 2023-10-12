import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
export interface Response{
    source_code?:string,
    response?:string
}

export interface MetaProps{
  type?:string,
  source_code?:string,
  language?:string
}

export interface ResponseProps{
    response?:string
}

export const SourceView = (props: MetaProps) => {
  return (
    <div>
      <h1>{props.type}</h1>
      <ReactMarkdown
        children={`\`\`\`${props.language.toLowerCase()}\n${props.source_code}\n\`\`\``}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                // showLineNumbers={true}
                collapse={true}
                wrapLongLines={true}
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

export const CodeSelector = (props: ResponseProps) => {
    return (
        <div>
          <h1>Response</h1>
          <ReactMarkdown
            children={props.response}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    // showLineNumbers={true}
                    wrapLongLines={true}
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