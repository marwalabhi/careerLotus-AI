'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownProps = {
  children: string;
  className?: string;
};

type CodeRendererProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="mt-4 mb-3 text-xl font-semibold" {...props} />,
          h2: ({ node, ...props }) => <h2 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
          h3: ({ node, ...props }) => <h3 className="mt-3 mb-2 font-semibold" {...props} />,
          p: ({ node, ...props }) => <p className="mb-3 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="mb-3 ml-5 list-disc space-y-1" {...props} />,
          ol: ({ node, ...props }) => (
            <ol className="mb-3 ml-5 list-decimal space-y-1" {...props} />
          ),
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-primary underline underline-offset-2 hover:opacity-90"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          code: ({ inline, className: cn, children, ...props }: CodeRendererProps) => (
            <code
              className={
                (cn || '') +
                (inline
                  ? ' bg-muted rounded px-1 py-0.5 text-sm'
                  : ' bg-muted block overflow-x-auto rounded-md p-3 text-sm')
              }
              {...props}
            >
              {children}
            </code>
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-muted-foreground/30 text-muted-foreground border-l-4 pl-3 italic"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-3 w-full overflow-x-auto">
              <table className="w-full text-left text-sm" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border-b px-2 py-1 font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => <td className="border-b px-2 py-1" {...props} />,
          hr: () => <hr className="border-border my-4" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
