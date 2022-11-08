import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthContextProvider } from './hooks/useAuth';
import { ToastContextProvider } from './hooks/useToast';
import { NoticeContextProvider } from './hooks/useNotice';
import { EditModeContextProvider } from './hooks/useEditMode';
import { EnumContextProvider } from './hooks/useEnums';
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <NoticeContextProvider>
        <ToastContextProvider>
          <AuthContextProvider>
            <EditModeContextProvider>
              <EnumContextProvider>
                <App />
              </EnumContextProvider>
            </EditModeContextProvider>
          </AuthContextProvider>
        </ToastContextProvider>
      </NoticeContextProvider>
    </Router>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
