import React, { FC, useRef, ChangeEvent, useState } from 'react';
import axios from 'axios';
import UploadList from './uploadList';
import Gragger from './dragger';

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadFileStatus;
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;
}
export interface UploadProps {
  action: string;
  beforeUpload?: (file: File) => boolean | Promise<File>;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onChange?: (file: File) => void;
  onRemove?: (file: UploadFile) => void;
  headers?: {[key: string]: any };
  name?: string;
  data?: {[key: string]: any };
  withCredentials?: boolean;
  accept?: string;
  multiple?: boolean;
  drag?: boolean;
}

export const Upload: FC<UploadProps> = (props) => {
  const { 
    action,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
    onRemove,
    headers,
    name,
    data,
    withCredentials,
    accept,
    multiple,
    drag,
    children
  } = props;
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] =  useState<UploadFile[]>([]);

  const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
    setFileList(prevList => {
      return prevList.map(file => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj };
        } else {
          return file;
        }
      });
    });
  };
  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return false;
    }
    uploadFiles(files);
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };
  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files);
    postFiles.forEach(file => {
      if (!beforeUpload) {
        post(file);
      } else {
        const result = beforeUpload(file);
        if (result && result instanceof Promise) {
          result.then(processedFile => {
            post(processedFile);
          });
        } else if (result !== false) {
          post(file);
        }
      }
    });
  };
  const post =  (file: File) => {
    let _file: UploadFile = {
      uid: Date.now() + 'upload-file',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file
    };
    setFileList(prevList => {
      return [_file, ...prevList];
    });
    const formData = new FormData();
    formData.append(name || 'file', file);
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }
    axios.post(action, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials, 
      onUploadProgress: (e) => {
        let percentage = Math.round(100 * e.loaded / e.total) || 0; 
        if (percentage < 100 && onProgress) {
          updateFileList(_file, {percent: percentage, status: 'uploading'});
          onProgress(percentage, file);
        }
      }
    }).then(res => {
      updateFileList(_file, {status: 'success', response: res.data});
      if (onSuccess) {
        onSuccess(res.data, file);
      }
      if (onChange) {
        onChange(file);
      }
    }).catch(err => {
      updateFileList(_file, { status: 'error', error: err});
      if (onError) {
        onError(err, file);
      }
      if (onChange) {
        onChange(file);
      }
    });
  };
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter(item => item.uid !== file.uid);
    });
    if (onRemove) {
      onRemove(file);
    }
  };
  return (
    <div className="meow-upload">
      <div className="meow-upload-select" onClick={handleClick}>
        {drag ? <Gragger onFile={uploadFiles}>{children}</Gragger> : children}
        <input 
          type="file"
          className="meow-file-input"
          style={{display: 'none'}}
          ref={fileInput}
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
        />
      </div>
      <UploadList 
        fileList={fileList}
        onRemove={handleRemove}
      />
    </div>
  );
};
Upload.defaultProps = {
  name: 'file'
};

export default Upload;
