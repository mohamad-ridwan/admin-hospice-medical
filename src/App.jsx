import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home/Home';
import UploadBlog from './pages/UploadBlog/UploadBlog';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/upload-blog' element={<UploadBlog/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
