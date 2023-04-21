export const isSupportedExtension = (url: string) => {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.svg'];

  return supportedExtensions.some((ext) => url.endsWith(ext));
};
