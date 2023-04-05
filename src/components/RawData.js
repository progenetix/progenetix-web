import React, { useState } from 'react';

export function ShowJSON({ data }) {

  const [isOpened, setIsOpened] = useState(false);

  function toggle() {
    setIsOpened(wasOpened => !wasOpened);
  }

  return (
    <>
      <h5>Raw Data</h5>
      <span onClick={toggle}>⇒ click to show/hide</span>
        {isOpened && (
        <div>

          <pre className="prettyprint">{ JSON.stringify(data, null, 2) }</pre>
        </div>
      )}
    </>
  )
}
