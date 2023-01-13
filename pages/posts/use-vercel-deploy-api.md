---
title: Use Vercel Api
date: 2023-01-02T08:52:58.140Z
lang: zh
duration: 6min
---

[[toc]]

## Serverless

简单地理解：`Serverless` = `Faas`（函数即服务） + `Baas`（后端即服务）

Serverless不代表再也不需要服务器了，而是说：开发者再也不用过多考虑服务器的问题

## 第一个api接口

初始化package.json、引入vercel相关的Typescript便于规范

```bash
npm i @vercel/node -D # 安装vercel依赖库 
```

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const data = {
    msg: 'hello world!'
  }
  res.status(200).json(data)
}
```

执行 `vercel dev` 进行本地调试，需要本地安装vercel脚手架

部署我比较偏向于到官网部署。

## 数据库持久化

可以使用云数据库。
[https://cloud.mongodb.com](https://cloud.mongodb.com) 提供的Mongodb数据库举例，512M免费存储额度，个人使用已经绰绰有余。

以mongodb做例子，我们的node文件需要安装mongodb相关的依赖库。`mongodb mongoose`。具体用法这里不详细说明了。

例子：
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { MongoClient } from 'mongodb'
const CONNECTION_STRING = 'mongodb+srv://xxx/vercel'
module.exports = async (req: VercelRequest, res: VercelResponse) => {
  const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  const db = await client.db('vercel')
  const result = await db.collection('helloworld').find().toArray()
  console.log(client)
  console.log(db)
  console.log(result)
  res.status(200).json(result)
}
```

## P.S.

### Vercel.json 重定向说明

根据你项目的文件夹目录，举个例子。
部署完成后，默认的路由路径是 /api，此时 / 会显示文件目录

通过配置文件 vercel.json 配置 Rewrites/Redirects可更好地扩展路由,快速实现反向代理、路由转换等功能。

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/api"
    }
  ]
}
```

### CORS跨域

需要单独配置，设置请求头
```ts
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

module.exports = allowCors(async (req: VercelRequest, res: VercelResponse) => {
  /// ...
})
```

### 缓存

这部分需要参照下文档，不过应该就是需要设置这个header。
```ts
res.setHeader('Cache-Control', 's-maxage=86400')
```

### ref
- [Vercel搭建API 服务，无需服务器](https://tangly1024.com/article/vercel-free-serverless-api#2f035393d87343ac81a8ff05b9b27d46)
- [kitiho-api](https://github.com/kitiho/kitiho-api)
