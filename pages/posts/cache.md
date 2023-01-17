---
title: About Cache
date: 2023-01-11T06:42:57.950Z
lang: zh
duration: 6min
---

[[toc]]

## Why HTTP Caching is important?
- faster your web
- mobile user may pay for net

## Cache hits and misses

<figure>
  <img src="/images/cache-1.png" alt="Cache hits and misses" />
  <figcaption>Cache hits and misses</figcaption>
</figure>

## CDN
reverse proxy server.

## Directives
`cache-control` in Response Headers.

<figure>
  <img src="/images/cache-2.png" alt="cache-control" />
  <figcaption>cache-control</figcaption>
</figure>

### max-age
maximum time , seconds

### no-store
shouldn't store any data in cache.

like bank account, html file.

### no-cache 
always go to server ,omit cache, always miss.

### must-revalidate
make sure you never get stale data

### public / private
- public, allow file can be in CDN
- private, only in browser cache, use for sensitive info.

### immutable
data never gonna change. quite risky.

### stale-while-revalidate
get data from cache while revalidate. backup.

### stale-if-error
as name.

## Heuristic Cache
don't have `cache-control`

<figure>
  <img src="/images/cache-3.png" alt="Heuristic Cache" />
  <figcaption>Heuristic Cache</figcaption>
</figure>

different headers:

### Last-Modified
response header

### If-Modified-Since
request header.

compare with `Last-Modified`

may cause some problem of timezone.

### E-tag/If-None-Match
check if match tag. hash name.

### Cache Busting

<figure>
  <img src="/images/cache-4.png" alt="Cache Busting" />
  <figcaption>Cache Busting</figcaption>
</figure>

like `main.asdf23dsa.js`.
good for dynamic data.


