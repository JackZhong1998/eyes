// 摄像头和拍照界面
import React, { useState, useRef, useCallback } from 'react';
import { vibrate } from '../utils/vibrate';

function Camera({ onSend, loading }) {
  const [cameraMode, setCameraMode] = useState('preview'); // 相机模式:preview(预览)|capture(拍照)
  const [capturedImage, setCapturedImage] = useState(null); // 捕获的图像数据
  const videoRef = useRef(null); // 视频流引用

  // 获取摄像头权限
  const getCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = videoRef.current;
      videoElement.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      vibrate(); // 震动提醒错误
      // 显示错误提示
    }
  }, []);

  // 在组件挂载时获取摄像头权限
  useEffect(() => {
    getCamera();
  }, [getCamera]);

  // 捕获图像
  const captureImage = () => {
    const videoElement = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    setCameraMode('capture');
    vibrate(); // 震动反馈
  };

  // 发送图像到服务器进行分析
  const sendImage = async () => {
    try {
      const response = await fetch('/api/getImage', {
        method: 'POST',
        headers: { 'Content-Type': 'image/png' },
        body: capturedImage,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const text = await response.text();
      onSend(text); // 传递分析结果给父组件
    } catch (error) {
      console.error('Error analyzing image:', error);
      vibrate(); // 震动提醒错误
      // 显示错误提示
    }
  };

  return (
    <div className="camera">
      {cameraMode === 'preview' && (
        <>
          <video ref={videoRef} autoPlay />
          <button onClick={captureImage}>拍照</button>
        </>
      )}
      {cameraMode === 'capture' && (
        <>
          <img src={capturedImage} alt="Captured" />
          <button onClick={() => setCameraMode('preview')}>重新拍摄</button>
          <button onClick={sendImage} disabled={loading}>
            {loading ? '正在分析...' : '发送照片'}
          </button>
        </>
      )}
    </div>
  );
}

export default Camera;