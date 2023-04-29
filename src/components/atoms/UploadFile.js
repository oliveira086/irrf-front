import React from 'react'

import Dropzone from 'react-dropzone';

import { AiOutlineUpload } from 'react-icons/ai'

const UploadFile = ({ onUpload, title, accept, file }) => {
  const renderDragMessage = (isDragActive, isDragReject) => {
    if(!isDragActive) {
      if(file !== undefined) {
        return <div className='flex justify-center items-center p-2 border-dashed border-2 rounded-lg border-[#2F4ECC] text-[#2F4ECC] bg-[#f2f5ff] cursor-pointer'><AiOutlineUpload className='mr-2' size={26} />{file.name}</div>
      }
      return <div className='flex justify-center items-center p-2 border-dashed border-2 rounded-lg border-[#2F4ECC] text-[#2F4ECC] bg-[#f2f5ff] cursor-pointer'><AiOutlineUpload className='mr-2' size={26} />{title}</div>
    }

    if(isDragReject) {
      return <div className='flex p-2 border-dashed border-2 rounded-lg border-[#cc2f63] text-[#cc2f63] bg-[#f2f5ff]' type="error"><AiOutlineUpload className='mr-2' size={26} />Arquivo não suportado</div>
    }

    return <div type="success">Solte o arquivo aqui</div>
  }

  return (
    <Dropzone accept={accept} onDropAccepted={onUpload} multiple={false}>
      { ({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <div className='w-auto h-auto'
          {...getRootProps()}
          isDragActive={isDragActive}
          isDragReject={isDragReject}
        >
          <input {...getInputProps()} />
          {renderDragMessage(isDragActive, isDragReject)}
        </div>
      ) }
    </Dropzone>
  );
}

export default UploadFile;