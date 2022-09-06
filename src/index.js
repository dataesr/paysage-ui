import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './hooks/useAuth';
import { ToastContextProvider } from './hooks/useToast';
import { NoticeContextProvider } from './hooks/useNotice';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NoticeContextProvider>
      <ToastContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ToastContextProvider>
    </NoticeContextProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
