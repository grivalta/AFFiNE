import { type Location } from 'history';
import { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useLocation } from 'react-router-dom';

import type { Workbench } from './workbench';

export function useBindWorkbenchToDesktopRouter(
  workbench: Workbench,
  basename: string
) {
  const browserLocation = useLocation();

  useEffect(() => {
    const newLocation = browserLocationToViewLocation(
      browserLocation,
      basename
    );
    if (newLocation === null) {
      return;
    }

    workbench.open(newLocation);
  }, [basename, browserLocation, workbench]);
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
