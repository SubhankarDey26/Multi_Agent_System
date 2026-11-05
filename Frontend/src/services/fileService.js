import { SAMPLE_FILES } from '../mocks/mockData';

let filesStore = [...SAMPLE_FILES];

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
    return newFile;
  },

  deleteFile(fileId) {
    filesStore = filesStore.filter((f) => f.id !== fileId);
    return true;
  },
};

export default fileService;
