var express = require('express');						
var fs = require('fs');									
var formidable = require('formidable');						
var cacheFolder = 'public/images/';
var app = express();

fs.exists('./public/images',function (data) {
	if(!data) {
		fs.mkdir('./public/images',function (err) {
			if (err) console.log(err)
			console.log('创建成功')
		})
	} else {
		console.log('已经存在')
	}
})

app.use('/public/images',express.static('./public/images'));	

app.post('/post', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin','*');
	if (!fs.existsSync(cacheFolder)) {
      	fs.mkdirSync(cacheFolder);
  	}
	var form = new formidable.IncomingForm();						
	form.encoding = 'utf-8';									
	form.uploadDir = cacheFolder;								
  	form.keepExtensions = true; 									
  	form.maxFieldsSize = 2 * 1024 * 1024;							
  	form.type = true;												
	form.parse(req, function(err, fields, files) {
  		if (err) {
     		return res.json(err);
  		}
  		var extName = '';
  		switch (files.upload.type) {
      		case 'image/pjpeg':
          		extName = 'jpg';
          		break;
      		case 'image/jpeg':
          		extName = 'jpg';
          		break;
      		case 'image/png':
          		extName = 'png';
          		break;
      		case 'image/x-png':
          		extName = 'png';
          		break;
  		}
  		if (extName.length === 0) {
      		return  res.json({
          		msg: '只支持png和jpg格式图片'
      		});
  		} else {
      		var avatarName = '/' + Date.now() + '.' + extName;		
      		var newPath = form.uploadDir + avatarName;				
      		fs.renameSync(files.upload.path, newPath);				
      		return res.json(newPath);				
  		}
	});
});


app.listen(8888, function () {
  console.log("app is listening");
});