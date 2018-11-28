import React from 'react';
import styles from './Bookshelf.css';

class Bookshelf extends React.Component {

  constructor(props) {
    super(props);

    this.changeSortOption = this.changeSortOption.bind(this);
    this.changeSortOrder = this.changeSortOrder.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleNumberSubmit = this.handleNumberSubmit.bind(this);

    this.state = {
      booksOrderedBySale: [],
      books: [],
      sortOption: 'rank',
      sortOrder: 'ascending',
      numberBooks: 40,
    };
  }

  componentDidMount() {
    const googleBooksURL = 'https://www.googleapis.com/books/v1/volumes?q=software&maxResults=40';
    let books;

    function getBooks(googleBooksURL) {
      return new Promise(resolve => {
        fetch(googleBooksURL)
          .then(data => {
            return data.json();
          })
          .then(res => { 
            resolve(res.items);
          });
      });
    }

    async function grabTop200Books() {
      // TODO: Use loop to increment start index
      const books1 = await getBooks(googleBooksURL + '&startIndex=' + 0);
      const books2 = await getBooks(googleBooksURL + '&startIndex=' + 40);
      const books3 = await getBooks(googleBooksURL + '&startIndex=' + 80);
      const books4 = await getBooks(googleBooksURL + '&startIndex=' + 120); 
      const books5 = await getBooks(googleBooksURL + '&startIndex=' + 160);

      books = books1.concat(books2, books3, books4, books5);
      return books;
    }

    grabTop200Books().then((books) => {
      this.setState({ 
        books: books.slice(0, this.state.numberBooks),
        booksOrderedBySale: books,
      }); 
    })

  }

  /**
   * changeSortOption(event)
   * Switches to user's chosen sort option, i.e. title alphabetically, price, publication date
   */
  changeSortOption(event) {
    const booksToOrder = this.state.booksOrderedBySale.slice(0, this.state.numberBooks);
    if (event.target.value === 'rank') {
      let newBookOrder;
      if (this.state.sortOrder === 'ascending') {
        newBookOrder = booksToOrder;
      } else {
        newBookOrder = booksToOrder.reverse();
      }
      this.setState({
        books: newBookOrder,
      });
    } else {
      this.setState({
        sortOption: event.target.value,
        books: booksToOrder
          .sort(this.customSort(false).bind(this))
      });
    }
  }

  /**
   * changeSortOrder(event)
   * Swaps between ascending and descending order of books by chosen value
   */  
  changeSortOrder(event) {
    const booksToOrder = this.state.booksOrderedBySale.slice(0, this.state.numberBooks);
    if (this.state.sortOption === 'rank') {
      let newBookOrder;
      if (event.target.value === 'ascending') {
        newBookOrder = booksToOrder;
      } else {
        newBookOrder = booksToOrder.reverse();
      }
      this.setState({
        books: newBookOrder,
      });
    } else {
      this.setState({
        sortOrder: event.target.value,
        books: booksToOrder
          .sort(this.customSort(true).bind(this))
      });
    }
  }

  /**
   * customSort(orderChange: string)
   * Performs work of sorting by whatever choice user most recently made
   * Deals with missing properties by setting comparison to null
   */ 
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

  /**
   * handleNumberChange(event)
   * Runs whenever user increments or decrements requested number of books
   */ 
  handleNumberChange(event) {
    this.setState({numberBooks: event.target.value});    
  }

  /**
   * handleNumberChange(event)
   * Runs whenever user submits to request to view a new number of books
   */ 
  handleNumberSubmit(event) {
    event.preventDefault();
    this.setState({
      books: this.state.booksOrderedBySale.slice(0, this.state.numberBooks)
    });
  }

  render() {
    if (!this.state.books.length > 0) {
      return (
        <div className="title">Fetching books...</div>
      ); 
    }
    const bookComponents = this.state.books.map((book, index) => {
      return (
        <div className="book" key={index}>
          {book.volumeInfo.title && <div className="title">{book.volumeInfo.title}</div>}
          {book.volumeInfo.authors && <div className ="authors">{'By '}
            {book.volumeInfo.authors.map((author, index) => {
              return (
                <span key={index}>
                  {author}{book.volumeInfo.authors.length - 1 !== index && ', '}
                </span>);
            })}
          </div>}
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
          <div>Top Programming Books</div>
          <span className="show-top-label">Rank by: </span>
            <select className="sort-select" defaultValue={this.state.sortOption} onChange={this.changeSortOption}>
              <option value='rank'>Sales Rank</option>
              <option value='title'>Title</option>
              <option value='retailPrice'>Price</option>
              <option value='publishedDate'>Date of Publication</option>
            </select>
            <select className="sort-select" defaultValue={this.state.sortOrder} onChange={this.changeSortOrder}>
              <option value={'ascending'}>Ascending</option>
              <option value={'descending'}>Descending</option>
            </select>
            <form className="show-top-form" onSubmit={this.handleNumberSubmit}>
              <label className="show-top-label">
                {`Show top:  `}  
                <input className="show-top-input" 
                  type="number" 
                  name="numberOfBooksToShow" 
                  min="1"
                  max="200"
                  value={this.state.numberBooks}
                  onChange={this.handleNumberChange}/>
              </label>
              <input className="show-top-submit" type="submit" value="Submit" />
            </form>
        </div>
        <div className="bookshelf">{bookComponents}</div>
      </div>
    )

  }
}
export default Bookshelf;
