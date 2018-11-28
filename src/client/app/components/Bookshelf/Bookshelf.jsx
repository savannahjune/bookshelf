import React from 'react';
import styles from './Bookshelf.css';
// import Select from '@material-ui/core/Select';

class Bookshelf extends React.Component {

  constructor(props) {
    super(props);

    this.getBooks = this.getBooks.bind(this);

    this.state = {
      books: [],
      sortOption: 'title',
      sortOrder: 'ascending',
    };
  }

  componentDidMount() {
    this.getBooks();
  }

  /**
   * getBooks()
   * Gets data from google books api
   */
  getBooks() {
    const googleBooksURL = 'https://www.googleapis.com/books/v1/volumes?q=software&maxResults=40';
    let books = fetch(googleBooksURL)
      .then(data => {
        return data.json();
      })
      .then(res => { 
        console.log(res.items);  
        this.setState({ books: res.items }); 
      });
  }





  render() {
    const books = this.state.books.map((book, index) => {
      return (
        <div className="book" key={index}>
          <div className="title">{book.volumeInfo.title}</div>
          <div className ="authors">{'By '}
            {book.volumeInfo.authors.map((author, index) => {
              return (
                <span key={index}>
                  {author}{book.volumeInfo.authors.length - 1 !== index && ', '}
                </span>);
            })}
          </div>
          <img className="cover" src={book.volumeInfo.imageLinks.smallThumbnail}/>
          {book.volumeInfo.subtitle && <div className="subtitle">'{book.volumeInfo.subtitle}'</div>}
          {book.saleInfo && book.saleInfo.retailPrice && 
            <div className="retailPrice">
              Retail Price: {book.saleInfo.retailPrice.amount}
            </div>
          }
        </div>
      )
    });

    return (
      <div className="body">
        <div className="header">
          <div className="title">Bookshelf</div>
            <select defaultValue={this.state.sortOption}>
              <option value={'title'}>Title</option>
              <option value={'retailPrice'}>Price</option>
              <option value={'publishedDate'}>Date of Publication</option>
            </select>
            <select defaultValue={this.state.sortOrder}>
              <option value={'ascending'}>Ascending</option>
              <option value={'descending'}>Descending</option>
            </select>
        </div>
        <div className="bookshelf">{books}</div>
      </div>
    )

  }
}
export default Bookshelf;
