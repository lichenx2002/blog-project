// src/components/SafeMarkdown.tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import React from "react";

interface Props {
    content: string
}

const MarkdownComponents = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
            <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        ) : (
            <code className={className} {...props}>
                {children}
            </code>
        )
    },
    img: ({ src, alt }: any) => (
        <img
            src={src}
            alt={alt || ''}
            className="my-4 rounded-lg"
            loading="lazy"
        />
    ),
    a: ({ href, children }: any) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
        >
            {children}
        </a>
    )
}

const SafeMarkdown:React.FC<Props> = ({ content }) => {
    return (
        <ReactMarkdown
            components={MarkdownComponents}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
        >
            {content}
        </ReactMarkdown>
    )
}

export default SafeMarkdown ;