/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const connectDB = require('../db');
const book = require('../models/newBook');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      book.find()
        .then((data) => {
         
          return res.status(200).json(data);
        })
        .catch((error) => {
          console.log(error);
        })
    })

    .post(function (req, res) {

      let title = req.body.title;
      

      if (!title) {
        return res.status(200).send("missing required field title")

      } else {

        let newBook = new book({
          title: title
        });

        newBook.save()
          .then((data) => {

            return res.status(200).json(data);
          })
          .catch((error) => {
            console.log(error)
          })
      }

      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      book.deleteMany()
        .then((data) => {
         
          return res.status(200).send("complete delete successful")
          
        })
        .catch((error) => {
          console.log(error)
        })
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      if (ObjectId.isValid(bookid)) {
        book.findById(bookid)
          .then((data) => {
            if (data) {
              res.status(200).json(data);
            } else {
              return res.status(200).send('no book exists')
            }
          }).
          catch((error) => {
            console.log(error);
          })

      } else {
        return res.status(200).send('no book exists')
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        return res.status(200).send("missing required field comment")
      } else if (ObjectId.isValid(bookid)) {      

        const opts = { new: true }

        book.findOneAndUpdate({
          _id: bookid
        },
          [
            {
              $set: {
                comments: {
                  $setUnion: [
                    "$comments",
                    [
                      comment
                    ]
                  ]
                }
              }
            },
            {
              $set: {
                commentcount: {
                  $size: "$comments"
                }
              }
            }
          ],
          opts)
          .then((data) => {
            if (data) {
              return res.status(200).json(data);
            } else {
              return res.status(200).send("no book exists");
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        return res.status(200).send("no book exists")
      }

      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (ObjectId.isValid(bookid)) {
        book.findByIdAndDelete(bookid)
          .then((data) => {
            if (data) {
              
              return res.status(200).send("delete successful")
            } else {
              return res.status(200).send("no book exists")
            }
          }).
          catch((error) => {
            console.log(error);
          })
      } else {
        return res.status(200).send("no book exists")
      }
    });

};
