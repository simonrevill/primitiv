import { useCallback, useEffect } from "react";

import { AvatarImageLoadingStatus } from "../types";

/**
 * Tracks the load lifecycle of an `Avatar.Image` and reports each change to
 * the Avatar root via `setStatus`.
 *
 * On mount the image is reported as `"loading"`; the returned `onLoad` /
 * `onError` handlers then resolve it to `"loaded"` or `"error"`.
 */
export function useAvatarImage(
  setStatus: (status: AvatarImageLoadingStatus) => void,
) {
  useEffect(() => {
    setStatus("loading");
  }, [setStatus]);

  const onLoad = useCallback(() => setStatus("loaded"), [setStatus]);
  const onError = useCallback(() => setStatus("error"), [setStatus]);

  return { onLoad, onError };
}
