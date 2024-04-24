// 根组件,配置路由
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatView from './views/ChatView';
import DocumentationView from './views/DocumentationView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatView />} />
        <Route path="/documentation" element={<DocumentationView />} />
      </Routes>
    </Router>
  );
}

export default App;