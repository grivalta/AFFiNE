import { useLiveData } from '@toeverything/infra/livedata';
import { type Location } from 'history';
import { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useLocation, useNavigate } from 'react-router-dom';

import type { Workbench } from './workbench';

export function useBindWorkbenchToBrowserRouter(
  workbench: Workbench,
  basename: string
) {
  const navigate = useNavigate();
  const browserLocation = useLocation();

  const view = useLiveData(workbench.activeView);

  useEffect(() => {
    return view.history.listen(update => {
      if (update.action === 'POP' || update.action === 'REPLACE') {
        throw new Error(
          'POP and REPLACE view history is not allowed on browser'
        );
      }

      if (update.location.state === 'fromBrowser') {
        return;
      }

      const newBrowserLocation = viewLocationToBrowserLocation(
        update.location,
        basename
      );

      if (locationIsEqual(browserLocation, newBrowserLocation)) {
        return;
      }

      navigate(newBrowserLocation, {
        state: 'fromView',
      });
    });
  }, [basename, browserLocation, navigate, view]);

  useEffect(() => {
    const newLocation = browserLocationToViewLocation(
      browserLocation,
      basename
    );
    if (newLocation === null) {
      return;
    }

    view.history.push(newLocation, 'fromBrowser');
  }, [basename, browserLocation, view]);
}

function browserLocationToViewLocation(
  location: Location,
  basename: string
): Location | null {
  if (!location.pathname.startsWith(basename)) {
    return null;
  }
  return {
    ...location,
    pathname: location.pathname.slice(basename.length),
  };
}

function viewLocationToBrowserLocation(
  location: Location,
  basename: string
): Location {
  return {
    ...location,
    pathname: `${basename}${location.pathname}`,
  };
}

function locationIsEqual(a: Location, b: Location) {
  return (
    a.hash === b.hash &&
    a.pathname === b.pathname &&
    a.search === b.search &&
    a.state === b.state
  );
}
