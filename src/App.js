import { BrowserRouter } from 'react-router-dom';
import Routes from './navigation';
import { AuthContextProvider } from './hooks/useAuth';
import { ToastContextProvider } from './hooks/useToast';
import { NoticeContextProvider } from './hooks/useNotice';
import { EditModeContextProvider } from './hooks/useEditMode';
import { EnumContextProvider } from './hooks/useEnums';

export default function App() {
  return (
    <BrowserRouter>
      <NoticeContextProvider>
        <ToastContextProvider>
          <AuthContextProvider>
            <EditModeContextProvider>
              <EnumContextProvider>
                <Routes />
              </EnumContextProvider>
            </EditModeContextProvider>
          </AuthContextProvider>
        </ToastContextProvider>
      </NoticeContextProvider>
    </BrowserRouter>
  );
}
