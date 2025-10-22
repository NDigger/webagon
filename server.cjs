const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

app.listen(process?.env?.PORT ?? 3000, () => {
  console.log('Сайт запущен на http://localhost:3000');
});