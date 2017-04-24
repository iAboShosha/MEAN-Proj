import request from 'request-promise'
import parsexml from 'xml2js'
import { success } from '../../services/response/'


export const searchBooks = ({params}, res, next) => {
  request({
    uri: 'https://www.goodreads.com/search/index.xml',
    timeout: 5000,
    qs: {
      key: 'J5ZrAZGIQW2zkWYIyxWA',
      q: params.bookName
    }
  }).then((res) => {
    var parser = new parsexml.Parser({explicitArray: false});
    var searchbooks = [];
    parser.parseString(res, function (err, result) {
      var books = result.GoodreadsResponse.search.results.work;
      if(books){
        for (var i = 0; i < books.length; i++) {
          searchbooks.push(books[i].best_book);
        }
      }
    });
    return searchbooks;
  }).then(success(res, 201))
  .catch(next);
}
