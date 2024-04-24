// 主聊天视图
import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Camera from '../components/Camera';
import TextInput from '../components/TextInput';
import VoiceInput from '../components/VoiceInput';
import ChatBubble from '../components/ChatBubble';
import { vibrate } from '../utils/vibrate';

function ChatView() {
  const [mode, setMode] = useState('text'); // 输入模式:text(文本)|voice(语音)|camera(拍照)
  const [chatLog, setChatLog] = useState([]); // 聊天记录
  const [loading, setLoading] = useState(false); // 是否正在加载
  const bottomRef = useRef(null); // 用于滚动到底部

  // 处理发送按钮点击事件
  const handleSend = async (content) => {
    vibrate(); // 震动反馈
    setLoading(true); // 设置加载状态

    try {
      // 调用 OpenAI 文本生成 API
      const response = await fetch('/api/getText', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: content,
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const text = await response.text();

      // 更新聊天记录
      setChatLog((prevLog) => [
        ...prevLog,
        { from: 'user', content },
        { from: 'ai', content: text },
      ]);
    } catch (error) {
      console.error('Error generating text:', error);
      vibrate(); // 震动提醒错误
      // 显示错误提示
    } finally {
      setLoading(false); // 取消加载状态
      scrollToBottom(); // 滚动到底部
    }
  };

  // 滚动到底部
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 处理模式切换
  const handleModeChange = (newMode) => {
    setMode(newMode);
    vibrate(); // 震动反馈
  };

  // 在组件挂载时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="chat-view">
      <Header mode={mode} onModeChange={handleModeChange} />
      <div className="chat-log">
        {chatLog.map((item, index) => (
          <ChatBubble
            key={index}
            from={item.from}
            content={item.content}
            onSendClick={handleSend}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      {mode === 'text' && <TextInput onSend={handleSend} loading={loading} />}
      {mode === 'voice' && <VoiceInput onSend={handleSend} loading={loading} />}
      {mode === 'camera' && <Camera onSend={handleSend} loading={loading} />}
    </div>
  );
}

export default ChatView;