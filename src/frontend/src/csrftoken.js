import React from 'react';

const CSRFToken = () => {
  const csrfToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1]; // Extract the token from cookies

  return <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken || ''} />;
};

export default CSRFToken;
