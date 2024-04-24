// 顶部导航和提示
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ mode, onModeChange }) {
  const handleModeClick = (newMode) => {
    onModeChange(newMode);
  };

  return (
    <header>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/documentation">介绍文档</Link>
      </nav>
      <div className="mode-buttons">
        <button onClick={() => handleModeClick('text')}>打字提问</button>
        <button onClick={() => handleModeClick('voice')}>说话追问</button>
        <button onClick={() => handleModeClick('camera')}>拍照看路</button>
      </div>
      <div className="mode-prompt">
        {mode === 'text' && '请开始输入...'}
        {mode === 'voice' && '正在录音...'}
        {mode === 'camera' && '准备拍照...'}
      </div>
    </header>
  );
}

export default Header;