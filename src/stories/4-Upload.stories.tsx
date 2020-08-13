import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from "@storybook/addon-knobs";
import Upload from '../components/Upload/upload';
import Button from '../components/Button/button';
import Icon from '../components/Icon/icon';

export default {
  title: 'Upload 上传',
  component: Upload,
  decorators: [withKnobs],
  parameters: {
    info: {
      propTables:[Upload]
    }
  }
};

export const DefaultUpload = () => {
  return (
    <div style={{width: 360}}>
      <Upload
        // action="http://localhost:4000/api/upload"
        action="https://run.mocky.io/v3/bb47efab-eddf-4793-b858-8e9347dd7cfd"
        onProgress={action('change')}
      >
        <Button icon="cloud-upload-alt">Upload files</Button>
      </Upload>
    </div>
  );
};
DefaultUpload.story = {
  name: 'Upload'
};

const checkFileSize = (file: File) => {
  console.log(file);
  if (Math.round(file.size / 1024) > 50) {
    alert('file too big');
    return false;
  }
  return true;
};
// const filePromise = (file: File) => {
//   const newFile = new File([file], ' .docx', {type: file.type});
//   return Promise.resolve(newFile);
// };
export const SimpleUpload = () => {
  return (
    <div style={{width: 360}}>
      <Upload
        action="https://run.mocky.io/v3/bb47efab-eddf-4793-b858-8e9347dd7cfd"
        onProgress={action('progress')}
        beforeUpload={checkFileSize}
        onChange={action('changed')}
      >
        <Button icon="cloud-upload-alt">Upload files</Button>
      </Upload>
    </div>
  );
};
SimpleUpload.story = {
  name: '上传前检查文件大小'
};

export const GraggerUpload = () => {
  return (
    <Upload
      action="https://run.mocky.io/v3/bb47efab-eddf-4793-b858-8e9347dd7cfd"
      onProgress={action('progress')}
      onChange={action('changed')}
      drag={true}
    >
      <Icon icon="cloud-upload-alt" className="meow-icon-upload"/>
      <div className="meow-upload-text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </Upload>
  );
};
GraggerUpload.story = {
  name: '拖动上传'
};
