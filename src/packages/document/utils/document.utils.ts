export const getResourceType = (fileExtension: string): 'raw' | 'image' | 'video' => {
  const ext = fileExtension.toLowerCase();

  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar', '7z'].includes(ext)) {
    return 'raw';
  }

  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) {
    return 'video';
  }

  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(ext)) {
    return 'image';
  }

  return 'raw';
};
