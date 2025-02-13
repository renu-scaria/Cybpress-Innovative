
let router = require('express').Router();
const userModel = require('../models/userModel');
const BlogModel=require('../models/blogModel')
const Misc = require('../controllers/Misc');
const userAuth = require('../middlewares/userAuth'); 


router.post('/blog/add', userAuth, async (req, res) => {
          try {
              var { title,content } = req.body;
              if (Misc.isnullorempty(title)) {
                  res.status(200).json({
                      status: false,
                      msg: 'Please provide title'
                  });
                  return;
              }
              if (Misc.isnullorempty(content)) {
                  res.status(200).json({
                      status: false,
                      msg: 'Invalid content'
                  });
                  return;
              }
                  
              var blog = new BlogModel({
                  content: content,
                  title: title,
                  userId:req.user.id
              });
  
              await blog.save();
  
              res.status(200).json({
                  status: true,
                  msg: 'Blog added successfully'
              });
              return;
          } catch (e) {
              console.log(e)
              res.status(500).json({
                  status: false,
                  msg: 'Something went wrong',
              });
              return;
          }
});

router.post('/blog/delete', userAuth, async (req, res) => {
      try {
          var { blogId } = req.body;
  
          if (Misc.isnullorempty(blogId)) {
              res.status(200).json({
                  status: false,
                  msg: 'Please provide blogId'
              });
              return;
          }
  
          var blog = await BlogModel.findOne({ _id: blogId,status: 'Active' });
          if (Misc.isnullorempty(blog)) {
              res.status(200).json({
                  status: false,
                  msg: 'Failed to find corresponding blog'
              });
              return;
          }
          blog.status="Deleted";
  
          await blog.save();
  
          res.status(200).json({
              status: true,
              msg: 'Blog  deleted successfully'
          });
          return;
      } catch (e) {
          console.log(e)
          res.status(500).json({
              status: false,
              msg: 'Something went wrong',
              e
          });
          return;
      }
      // })
  });
router.get('/blog/list', userAuth, async (req, res) => {
      try {
          var { page, limit } = req.query;
  
          var query = { status: 'Active' };
  
         
          query.userId = req.user.id;
  
          var pageNo = 1, dataLimit = 50;
          if ((!(Misc.isnullorempty(page))) && (!(Misc.isnullorempty(limit)))) {
              page = parseInt(page);
              limit = parseInt(limit);
              if ((typeof page === "number") && (typeof limit === "number") && (page > 0) && (limit > 0)) {
                  pageNo = page;
                  dataLimit = limit;
              }
          }
  
          var totalLength = await BlogModel.countDocuments(query);
          var blog = await BlogModel.find(query).sort({ create_date: -1 });
  
          res.status(200).json({
              status: true,
              msg: 'blog list retrieved successfully',
              totalLength: totalLength,
              page: pageNo,
              limit: dataLimit,
              data: blog
          });
          return;
  
      } catch (e) {
          console.log(e)
          res.status(500).json({
              status: false,
              msg: 'Something went wrong'
          });
      }
  });
  router.post('/blog/edit', userAuth, async (req, res) => {
          try {
              var { blogId, title,content } = req.body;
  
              if (Misc.isnullorempty(blogId)) {
                  res.status(200).json({
                      status: false,
                      msg: 'Please provide blog id'
                  });
                  return;
              }
  
              var blog = await BlogModel.findOne({ _id: blogId, status: 'Active' });
              if (Misc.isnullorempty(blog)) {
                  res.status(200).json({
                      status: false,
                      msg: 'Failed to find corresponding blog'
                  });
                  return;
              }
  
              if (!Misc.isnullorempty(title)) {
                  blog.title = title;
              }
              if (!Misc.isnullorempty(content)) {
                  blog.content = content;
              }

  
              await blog.save();

              res.status(200).json({
                  status: true,
                  msg: 'Blog details updated successfully'
              });
              return;
          } catch (e) {
              console.log(e)
              res.status(500).json({
                  status: false,
                  msg: 'Something went wrong',
              });
              return;
          }
      })
module.exports = router;