import { useCallback, useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { ComponentToPrint } from '../ComponentToPrint';

export function FunctionalComponentWithHook() {
  const componentRef = useRef(null);

  const onBeforeGetContentResolve = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleAfterPrint = useCallback(() => {
    console.log('`onAfterPrint` called'); // tslint:disable-line no-console
  }, []);

  const handleBeforePrint = useCallback(() => {
    console.log('`onBeforePrint` called'); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = useCallback(() => {
    console.log('`onBeforeGetContent` called'); // tslint:disable-line no-console
    setLoading(true);

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        setLoading(false);
        resolve();
      }, 2000);
    });
  }, [setLoading]);

  const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: 'AwesomeFileName',
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    if (
      typeof onBeforeGetContentResolve.current === 'function'
    ) {
      onBeforeGetContentResolve.current();
    }
  }, [onBeforeGetContentResolve.current]);

  return (
    <div>
      {loading && <p className="indicator">onBeforeGetContent: Loading...</p>}
      <button type="button" onClick={handlePrint}>
        Print using a Functional Component with the useReactToPrint hook
      </button>
      <ComponentToPrint ref={componentRef} />
    </div>
  );
}
