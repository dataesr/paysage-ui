import { BrowserRouter } from 'react-router-dom';
import { createInstance, MatomoProvider } from '@jonkoops/matomo-tracker-react';
import Routes from './navigation';
import { AuthContextProvider } from './hooks/useAuth';
import { ToastContextProvider } from './hooks/useToast';
import { NoticeContextProvider } from './hooks/useNotice';
import { EditModeContextProvider } from './hooks/useEditMode';
import { EnumContextProvider } from './hooks/useEnums';

const { REACT_APP_MATOMO_URL: urlBase, REACT_APP_MATOMO_SITE_ID: siteId } = process.env;
const matomo = createInstance({ urlBase, siteId });

export default function App() {
  return (
    <BrowserRouter>
      <NoticeContextProvider>
        <ToastContextProvider>
          <MatomoProvider value={matomo}>
            <AuthContextProvider>
              <EditModeContextProvider>
                <EnumContextProvider>
                  <Routes />
                </EnumContextProvider>
              </EditModeContextProvider>
            </AuthContextProvider>
          </MatomoProvider>
        </ToastContextProvider>
      </NoticeContextProvider>
    </BrowserRouter>
  );
}
