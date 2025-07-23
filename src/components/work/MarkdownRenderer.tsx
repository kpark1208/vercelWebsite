"use client";

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    />
  );
} 