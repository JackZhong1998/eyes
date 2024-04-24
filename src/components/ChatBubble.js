// 聊天记录气泡
import React, { useState } from 'react';

function ChatBubble({ from, content, onSendClick }) {
  const [playing, setPlaying] = useState(false);

  // 播放语音
  const playVoice = async () => {
    try {
      const response = await fetch('/api/getVoice', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: content,
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      setPlaying(true);

      audio.addEventListener('ended', () => {
        setPlaying(false);
        URL.revokeObjectURL(audioUrl);
      });
    } catch (error) {
      console.error('Error generating voice:', error);
      // 显示错误提示
    }
  };

  return (
    <div className={`chat-bubble ${from}`}>
      <div className="chat-header">{from === 'user' ? '我说' : 'AI 说'}</div>
      {content.startsWith('data:image/png;base64,') && (
        <img src={content} alt="Uploaded" />
      )}
      {!content.startsWith('data:image/png;base64,') && <div>{content}</div>}
      <button onClick={playVoice} disabled={playing}>
        {playing ? '正在播放...' : '播放语音'}
      </button>
      {from === 'ai' && (
        <button onClick={() => onSendClick(content)}>追问</button>
      )}
    </div>
  );
}

export default ChatBubble;