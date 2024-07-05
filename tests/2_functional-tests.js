/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const book = require('../models/newBook');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  before((done) => {

    book.deleteMany()
      .then((data) => {
        console.log('DB CLEARED!')
      })
      .catch((error) => {
        console.log(error)
      });
    done();

  });

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*   test('#example Test GET /api/books', function (done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/books')
        .send({ title: "Skeleton Key" })
        .end()
  
      chai.request(server)
        .get('/api/books')
        .end(function (err, res) {
          console.log(res.body)
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
    }); */
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {


    suite('POST /api/books with title => create book object/expect book object', function () {

      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({ title: "Stormbreaker" })
          .end(function (err, res) {
            assert.strictEqual(res.status, 200);
            assert.isObject(res.body, true);
            assert.property(res.body, 'title');
            assert.strictEqual(res.body.title, "Stormbreaker");
            done();
          })

      });

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send()
          .end(function (err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.text, "missing required field title");
            done();
          })

      });

    });

    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function (err, res) {
            assert.strictEqual(res.status, 200);
            assert.isArray(res.body, true);
            assert.isObject(res.body[0], true);
            assert.property(res.body[0], 'title');
            assert.strictEqual(res.body[0].title, "Stormbreaker");
            done();
          })

      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/IVALIDID123354')
          .end(function (err, res) {
            assert.strictEqual(res.status, 200);
            assert.isObject(res.body, true);
            assert.strictEqual(res.text, "no book exists");
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        book.findOne({})
          .then((data) => {

            chai
              .request(server)
              .keepOpen()
              .get(`/api/books/${data._id.toString()}`)
              .end(function (err, res) {
                assert.strictEqual(res.status, 200);
                assert.isObject(res.body, true);
                assert.property(res.body, 'title');
                assert.strictEqual(res.body.title, data.title);
                done();
              });

          })

      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        book.findOne({})
          .then((data) => {

            chai
              .request(server)
              .keepOpen()
              .post(`/api/books/${data._id.toString()}`)
              .send({ comment: "best book ever" })
              .end(function (err, res) {
                assert.strictEqual(res.status, 200);
                assert.isObject(res.body, true);
                assert.property(res.body, 'title');
                assert.property(res.body, 'comments');
                assert.include(res.body.comments, "best book ever");
                assert.strictEqual(res.body.title, data.title);
                done();
              });

          })

      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        book.findOne({})
          .then((data) => {

            chai
              .request(server)
              .keepOpen()
              .post(`/api/books/${data._id.toString()}`)
              .send()
              .end(function (err, res) {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.text, "missing required field comment");
                done();
              });

          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {

        chai
          .request(server)
          .keepOpen()
          .post('/api/books/INVALIDID')
          .send({ comment: "best book ever" })
          .end(function (err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.text, "no book exists");
            done();
          });

      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        book.findOne({})
          .then((data) => {

            chai
              .request(server)
              .keepOpen()
              .delete(`/api/books/${data._id.toString()}`)
              .end(function (err, res) {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(res.text, "delete successful")
                done();
              });

          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/5587f2ak464ed4i44506d62a')
          .end(function (err, res) {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(res.text, "no book exists");
            done();
          });

      });

    });

  });

  after((done) => {

    book.deleteMany()
      .then((data) => {
        console.log('DB CLEARED!')
      })
      .catch((error) => {
        console.log(error)
      });
    done();

  });


});
