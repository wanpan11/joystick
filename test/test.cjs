const express = require('express')
const path = require('path')
const { exec } = require('child_process')

const app = express()
const port = 4999

app.use(express.static(path.resolve(__dirname, '../')))

app.listen(port, () => {
  const url = `http://localhost:${port}/test`
  console.log(url)
  open(url)
})

function open (url) {
  // 拿到当前系统的参数
  switch (process.platform) {
    // mac系统使用 一下命令打开url在浏览器
    case 'darwin':
      exec(`open ${url}`)
      break
      // win系统使用 一下命令打开url在浏览器
    case 'win32':
      exec(`start ${url}`)
      break
      // 默认mac系统
    default:
      exec(`open ${url}`)
  }
}
