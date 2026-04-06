/**
 * Gets the current GPS position.
 * Resolves with { latitude, longitude }
 * Rejects with a user-friendly error string.
 */
export const getGeoLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Location access denied. Please enable location services.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        resolve({ latitude, longitude });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject("Location access denied. Please allow location permission.");
        } else {
          reject("Location access denied. Unable to retrieve location.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

/**
 * Validates that coordinates are real and not (0,0).
 */
export const isValidGeoTag = (lat, lng) => {
  if (lat === null || lng === null || lat === undefined || lng === undefined) return false;
  if (lat === 0 && lng === 0) return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
};

/**
 * Draws geotag text onto the canvas over the captured frame.
 */
export const stampGeoTag = (canvas, lat, lng) => {
  const ctx = canvas.getContext("2d");
  const text = `📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  const padding = 8;
  const fontSize = Math.max(14, canvas.width * 0.025);

  ctx.font = `bold ${fontSize}px sans-serif`;
  const textWidth = ctx.measureText(text).width;

  // Background pill (compatible with all browsers)
  const rx = padding, ry = canvas.height - fontSize - padding * 3;
  const rw = textWidth + padding * 2, rh = fontSize + padding * 2, r = 6;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.moveTo(rx + r, ry);
  ctx.lineTo(rx + rw - r, ry);
  ctx.arcTo(rx + rw, ry, rx + rw, ry + r, r);
  ctx.lineTo(rx + rw, ry + rh - r);
  ctx.arcTo(rx + rw, ry + rh, rx + rw - r, ry + rh, r);
  ctx.lineTo(rx + r, ry + rh);
  ctx.arcTo(rx, ry + rh, rx, ry + rh - r, r);
  ctx.lineTo(rx, ry + r);
  ctx.arcTo(rx, ry, rx + r, ry, r);
  ctx.closePath();
  ctx.fill();

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, padding * 2, canvas.height - padding * 2);
};
