import './App.css'

import './index.css'

import { BrowserRouter } from 'react-router-dom';
import { ReactQueryProvider } from './app/providers/ReactQueryProvider';
import { AuthProvider } from './app/providers/AuthProvider';
import { AppRouter } from './app/router/AppRouter';

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;