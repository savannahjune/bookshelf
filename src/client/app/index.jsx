import React from 'react';
import {render} from 'react-dom';

import Bookshelf from './components/Bookshelf/Bookshelf.jsx';

class App extends React.Component {
  render () {
    return <Bookshelf />;
  }
}

render(<App/>, document.getElementById('app'));
