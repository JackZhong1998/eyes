// 语音输入和转文字
import React, { useState, useCallback } from 'react';
import { vibrate } from '../utils/vibrate';

function VoiceInput({ onSend, loading }) {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);

  // 获取麦克风权限
  const getMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks);
        sendAudio(audioBlob);
      });

      setRecording(true);
      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      vibrate(); // 震动提醒错误
      // 显示错误提示
    }
  }, []);

  // 发送语音数据到服务器进行转文字
  const sendAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/getVoiceText', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const text = await response.text();
      onSend(text); // 传递转换后的文字给父组件
    } catch (error) {
      console.error('Error transcribing audio:', error);
      vibrate(); // 震动提醒错误
      // 显示错误提示
    } finally {
      setRecording(false);
      setAudioChunks([]);
    }
  };

  const startRecording = () => {
    getMicrophonePermission();
    vibrate(); // 震动反馈
  };

  const stopRecording = () => {
    setRecording(false);
    vibrate(); // 震动反馈
  };

  return (
    <div className="voice-input">
      {!recording && (
        <button onClick={startRecording} disabled={loading}>
          开始录音
        </button>
      )}
      {recording && (
        <button onClick={stopRecording} disabled={loading}>
          停止录音
        </button>
      )}
    </div>
  );
}

export default VoiceInput;