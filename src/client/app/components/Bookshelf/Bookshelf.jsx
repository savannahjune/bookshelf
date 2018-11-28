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
      booksOrderedBySale: [],
      books: [],
      sortOption: 'rank',
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
        this.setState({ 
          booksOrderedBySale: res.items,
          books: res.items,
        }); 
      });
  }

  /**
   * changeSortOption(event)
   * Switches to user's chosen sort option, i.e. title alphabetically, price, publication date
   */
  changeSortOption(event) {
    if (event.target.value === 'rank') {
      let newBookOrder;
      if (this.state.sortOrder === 'ascending') {
        newBookOrder = this.state.booksOrderedBySale;
      } else {
        newBookOrder = this.state.booksOrderedBySale.reverse();
      }
      this.setState({
        books: newBookOrder,
      });
    } else {
      this.setState({
        sortOption: event.target.value,
        books: this.state.books
          .sort(this.customSort(false).bind(this))
      });
    }
  }

  /**
   * changeSortOrder(event)
   * Swaps between ascending and descending order of books by chosen value
   */  
  changeSortOrder(event) {
    if (this.state.sortOption === 'rank') {
      let newBookOrder;
      if (event.target.value === 'ascending') {
        newBookOrder = this.state.booksOrderedBySale;
      } else {
        newBookOrder = this.state.booksOrderedBySale.reverse();
      }
      this.setState({
        books: newBookOrder,
      });
    } else {
      this.setState({
        sortOrder: event.target.value,
        books: this.state.books
          .sort(this.customSort(true).bind(this))
      });
    }
  }

  customSort(orderChange) {
    let sortOption;
    let sortOrder;
    if (orderChange) { // depending on which option was recently changed, use event or state
      sortOption = this.state.sortOption;
      sortOrder = event.target.value;
    } else {
      sortOption = event.target.value;
      sortOrder = this.state.sortOrder;
    }
    
    return function(a, b) { 
      if (sortOption === 'title') {
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
      } else if (sortOption === 'retailPrice') {
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
      } else if (sortOption === 'publishedDate') {
        if (a.volumeInfo && a.volumeInfo.publishedDate) {
          a = new Date(a.volumeInfo.publishedDate);
        } else {
          a = null;
        }

        if (b.volumeInfo && b.volumeInfo.publishedDate) {
          b = new Date(b.volumeInfo.publishedDate);
        } else {
          b = null;
        }
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
      else if (sortOrder === 'ascending') {
        return a < b ? -1 : 1;
      }
      else if (sortOrder === 'descending') {
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
              <option value='rank'>Sales Rank</option>
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
