import React from 'react';

import TextEdit from 'cores/TextEdit';

export default {
  title: 'Component creation',
};

export const textEdit = () => <TextEdit />;

textEdit.story = {
  name: 'Text Component'
};
