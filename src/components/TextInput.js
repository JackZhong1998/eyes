// 文本输入框
import React, { useState } from 'react';

function TextInput({ onSend, loading }) {
  const [text, setText] = useState('');

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-input">
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="输入您的问题..."
      />
      <button type="submit" disabled={loading}>
        {loading ? '正在生成...' : '发送'}
      </button>
    </form>
  );
}

export default TextInput;