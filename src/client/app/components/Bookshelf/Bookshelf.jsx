import React from 'react';
import styles from './Bookshelf.css';
import { runInThisContext } from 'vm';
// import Select from '@material-ui/core/Select';

class Bookshelf extends React.Component {

  constructor(props) {
    super(props);

    this.getBooks = this.getBooks.bind(this);
    this.changeSortOption = this.changeSortOption.bind(this);
    this.changeSortOrder = this.changeSortOrder.bind(this);

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

  /**
   * changeSortOption()
   * Gets data from google books api
   */
  changeSortOption(event) {
    this.setState({
      sortOption: event,
      books: this.state.books
        .sort(this.customSort().bind(this))
    });
  }

  changeSortOrder(event) {  // TODO: handle ascend vs descend
    this.setState({
      sortOrder: event,
      books: this.state.books
        .sort(this.customSort().bind(this))
    });
  }

  customSort() {
    return function(a, b) { 
      if (event.target.value === 'title') {
        if (a.volumeInfo && a.volumeInfo.title) {
          a = a.volumeInfo.title;
        } else {
          a = null;
        }

        if (b.volumeInfo && b.volumeInfo.title) {
          b = b.volumeInfo.title;
        } else {
          b = null;
        }
      } else if (event.target.value === 'retailPrice') {
        if (a.saleInfo && a.saleInfo.retailPrice && a.saleInfo.retailPrice.amount) {
          a = a.saleInfo.retailPrice.amount;
        } else {
          a = null;
        }

        if (b.saleInfo && b.saleInfo.retailPrice && b.saleInfo.retailPrice.amount) {
          b = b.saleInfo.retailPrice.amount;
        } else {
          b = null;
        }
      } else if (event.target.value === 'publishedDate') { // TODO: Handle longer string date comparisons
        if (a.volumeInfo && a.volumeInfo.publishedDate) {
          a = Number(a.volumeInfo.publishedDate);
        } else {
          a = null;
        }

        if (b.volumeInfo && b.volumeInfo.publishedDate) {
          b = Number(b.volumeInfo.publishedDate);
        } else {
          b = null;
        }
        console.log('sorting by publish date', a, b);
      }
      
      if (a === null){
        return 1;
      }
      else if (b === null){
        return -1;
      }
      else if (a === b){
        return 0;
      }
      else if (this.state.sortOrder === 'ascending') {
        return a < b ? -1 : 1;
      }
      else if (this.state.sortOrder === 'descending') {
        return a < b ? 1 : -1;
      }
    };
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
              Retail Price: ${book.saleInfo.retailPrice.amount}
            </div>
          }
        </div>
      )
    });

    return (
      <div className="body">
        <div className="header">
          <div className="title">Bookshelf</div>
            <select className="select" defaultValue={this.state.sortOption} onChange={this.changeSortOption}>
              <option value='title'>Title</option>
              <option value='retailPrice'>Price</option>
              <option value='publishedDate'>Date of Publication</option>
            </select>
            <select className="select" defaultValue={this.state.sortOrder} onChange={this.changeSortOrder}>
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
