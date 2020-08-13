import React, { FC } from 'react';
import { UploadFile } from './upload';
import Icon from '../Icon/icon';
import Progress from '../Progress/progress';

export interface UploadListProps {
  fileList: UploadFile[];
  onRemove: (_file: UploadFile) => void;
}
export const UploadList: FC<UploadListProps> = (props) => {
  const { fileList, onRemove } = props;
  return (
    <ul className="meow-upload-list">
      {
        fileList.map(item => {
          return (
            <li className="meow-upload-list-item" key={item.uid}>
              <span className="meow-upload-list-item-name">
                <Icon icon="file-alt" theme="secondary"/>
                {item.name}
              </span>
              <span className="meow-upload-list-item-status">
                {(item.status === 'uploading' || item.status === 'ready') && <Icon icon="spinner" spin theme="primary" />}
                {item.status === 'success' && <Icon icon="check-circle" theme="success" />}
                {item.status === 'error' && <Icon icon="times-circle" theme="danger" />}
              </span>
              <span className="meow-upload-list-item-close">
                <Icon icon="times" onClick={() => onRemove(item)}/>
              </span>
              {
                item.status === 'uploading' && 
                <div className="meow-upload-list-item-progress">
                  <Progress percent={item.percent || 0} showText={false} strokeHeight={3}/>
                  <span>{`${item.percent}%`}</span>
                </div>
              }
              
            </li>
          );
        })
      }
    </ul>
  );
};

export default UploadList;
