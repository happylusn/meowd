import React from 'react';
import { render, RenderResult, fireEvent, wait, waitForElement, createEvent } from '@testing-library/react';
import axios from 'axios';
import Upload, { UploadProps } from '../upload';

jest.mock('../../Icon/icon', () => {
  return ({icon, onClick}: any) => {
    return <i onClick={onClick}>{icon}</i>;
  };
});

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>; 
const testProps: UploadProps = {
  action: "fakeurl.com",
  onSuccess: jest.fn(),
  onChange: jest.fn(),
  onRemove: jest.fn(),
  drag: true
};

let wrapper: RenderResult, fileInput: HTMLInputElement, uploadArea: HTMLElement;
const testFile = new File(['sss'], 'test.png', {type: 'image/png'});
describe('test upload component', () => {
  beforeEach(() => {
    wrapper = render(<Upload {...testProps}>Click to upload</Upload>);
    fileInput = wrapper.container.querySelector('.meow-file-input') as HTMLInputElement;
    uploadArea = wrapper.getByText('Click to upload');
  });
  it('upload process should works fine', async () => { 
    const {queryByText, getByText} = wrapper;
    mockedAxios.post.mockResolvedValue({'data': 'jest test'});
    // mockedAxios.post.mockImplementation(() => {
    //   return Promise.resolve({data: 'jest test'});
    // });
    expect(uploadArea).toBeInTheDocument();
    expect(fileInput).not.toBeVisible();
    fireEvent.change(fileInput, {target: {files: [testFile]}});
    expect(queryByText('spinner')).toBeInTheDocument();
    await waitForElement(() => queryByText('check-circle'));
    expect(queryByText('test.png')).toBeInTheDocument();
    // await wait(() => {
    //   expect(queryByText('test.png')).toBeInTheDocument();
    // });
    // expect(queryByText('check-circle')).toBeInTheDocument();
    expect(testProps.onSuccess).toHaveBeenCalledWith('jest test', testFile);
    expect(testProps.onChange).toHaveBeenCalledWith(testFile);

    // remove the uploaded file
    expect(queryByText('times')).toBeInTheDocument();
    fireEvent.click(getByText('times'));
    expect(testProps.onRemove).toHaveBeenCalledWith(expect.objectContaining({
      raw: testFile,
      status: 'success',
      name: 'test.png'
    }));
  });

  it('drag and drop files should works fine', async () => {
    fireEvent.dragOver(uploadArea);
    expect(uploadArea).toHaveClass('is-dragover');
    fireEvent.dragLeave(uploadArea);
    expect(uploadArea).not.toHaveClass('is-dragover');

    const mockDropEvent = createEvent.drop(uploadArea);
    Object.defineProperty(mockDropEvent, "dataTransfer", {
      value: {
        files: [testFile]
      }
    });
    fireEvent(uploadArea, mockDropEvent);
    await wait(() => {
      expect(wrapper.queryByText('test.png')).toBeInTheDocument();
    });
    expect(testProps.onSuccess).toHaveBeenCalledWith('jest test', testFile);
  });
});
