import React from 'react';
import FormView from '../FormView';
import PdfView from '../PdfView';
import { Main } from './styled';

const FileView = ({ file }) => {
  const { type } = file;
  
  return (
    <Main>
      {type === 'form' ? (
        <FormView />
      ) : (
        <PdfView />
      )}
    </Main>
  );
};

export default FileView;
