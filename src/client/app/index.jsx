import React from 'react';
import {render} from 'react-dom';
import d3 from 'd3';

import Bookshelf from './components/Bookshelf/Bookshelf.jsx';

class App extends React.Component {
  render () {
    return <Bookshelf />;
  }
}

render(<App/>, document.getElementById('app'));
