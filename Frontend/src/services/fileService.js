import { SAMPLE_FILES } from '../mocks/mockData';

const STORAGE_KEY = 'cortex_files_store';

const getStoredFiles = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse stored files:', err);
  }
  return [...SAMPLE_FILES];
};

let filesStore = getStoredFiles();

const persistFiles = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filesStore));
  } catch (err) {
    console.warn('Failed to persist files:', err);
  }
};

export const fileService = {
  getFiles() {
    return [...filesStore];
  },

  addFile(fileObj) {
    const newFile = {
      id: 'f-' + Date.now(),
      name: fileObj.name,
      type: fileObj.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: (fileObj.size / (1024 * 1024)).toFixed(1) + ' MB',
      uploadedAt: 'Just now',
      agent: 'User Upload',
      status: 'Indexed & Ready',
    };
    filesStore = [newFile, ...filesStore];
    persistFiles();
    return newFile;
  },

  deleteFile(fileId) {
    filesStore = filesStore.filter((f) => f.id !== fileId);
    persistFiles();
    return true;
  },
};

export default fileService;
