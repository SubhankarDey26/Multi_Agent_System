import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

export const MarkdownRenderer = ({ content = '' }) => {
  return (
    <div className="prose prose-invert max-w-none text-sm text-[#F1F5F9] leading-relaxed">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');

            if (!inline && (match || codeString.includes('\n'))) {
              return (
                <CodeBlock
                  language={match ? match[1] : 'javascript'}
                  code={codeString}
                />
              );
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-[#181D2A] border border-[#232B3E] font-mono text-xs text-[#56CFE1]"
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 rounded-lg border border-[#232B3E]">
                <table className="w-full text-left text-xs border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-[#181D2A] text-[#F1F5F9] font-semibold">{children}</thead>;
          },
          th({ children }) {
            return <th className="p-2.5 border-b border-[#232B3E]">{children}</th>;
          },
          td({ children }) {
            return <td className="p-2.5 border-b border-[#232B3E]/60 text-[#94A3B8]">{children}</td>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-[#8B7CFF] pl-3 py-1 my-2 bg-[#8B7CFF]/5 text-xs text-[#94A3B8] italic rounded-r">
                {children}
              </blockquote>
            );
          },
          ul({ children }) {
            return <ul className="list-disc list-inside space-y-1 my-2 text-[#94A3B8]">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside space-y-1 my-2 text-[#94A3B8]">{children}</ol>;
          },
          h1({ children }) {
            return <h1 className="text-xl font-bold text-[#F1F5F9] mt-4 mb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg font-bold text-[#F1F5F9] mt-3 mb-1.5">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base font-semibold text-[#8B7CFF] mt-2 mb-1">{children}</h3>;
          },
          p({ children }) {
            return <p className="my-1.5">{children}</p>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
