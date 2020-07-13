const express = require("express");

const app = express();

// 启动服务器 node index.js

// 解决跨域
app.use((req, res, next) => {
  // 允许跨域的地址
  res.set("Access-Control-Allow-Origin", "http://localhost:9528");
  // res.set("Access-Control-Allow-Origin", "*");
  // 是否进行预检请求
  res.set("Access-Control-Allow-Credentials", true);
  // 预检请求的缓存时间
  res.set("Access-Control-Max-Age", 36400);

  // 允许跨域的请求方式
  res.set("Access-Control-Allow-Mehtods", "GET,POST,PUT,DELETE");
  // 允许跨域的请求头
  res.set("Access-Control-Allow-Headers", "Content-Type");
  
  
  if (req.method === "options") {
    // 预检请求 直接返回响应
    res.end();
    return;
  }

  next();
});

// 请求地址： http://localhost:3000/search
app.get("/test", function (req, res) {
  res.cookie('token', 'abcdef')
  res.json({
    code: 2000, // 成功
    data: {name: 'Tom', age: 12}
  });
});

app.listen(3000, "localhost", (err) => {
  if (!err) console.log("服务器启动成功了，请访问 http://localhost:3000");
  else console.log(err);
});
