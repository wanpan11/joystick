const express = require('express')
const path = require('path')
const os = require('os')
const { exec } = require('child_process')

const app = express()
const port = 4999
const getIPAddress = function () {
  const iface = os.networkInterfaces()
  let ip = ''
  for (const dev in iface) {
    iface[dev].forEach(function (details) {
      if (ip === '' && details.family === 'IPv4' && !details.internal) {
        ip = details.address
      }
    })
  }
  return ip || '127.0.0.1'
}
const open = (url) => {
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

app.use(express.static(path.resolve(__dirname, '../')))
app.listen(port, () => {
  const ip = getIPAddress()
  console.log(`IPV4: http://${ip}:${port}/test`)
  console.log(`localhost: http://localhost:${port}/test`)
  open(`http://localhost:${port}/test`)
})
