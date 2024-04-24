// 介绍文档视图
import React from 'react';
import ReactMarkdown from 'react-markdown';
import documentationContent from '../documentation.md';

function DocumentationView() {
  return (
    <div className="documentation-view">
      <ReactMarkdown children={documentationContent} />
    </div>
  );
}

export default DocumentationView;