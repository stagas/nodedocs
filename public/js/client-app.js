function find (n, o, p, res) {
  var w = 0, ok, oki, m = 1
  n = n.toLowerCase()
  res = res || {}
  if (p) o.parentNode = p
  for (var k in o) {
    if ('object' === typeof o[k] && k !== 'parentNode') find(n, o[k], o, res)
    else if ('string' === typeof o[k]) {
      m = 1
      n.split(/\s/g).forEach(function (nw) {
        if ((w = (ok = o[k].toLowerCase()).split(nw).length - 1)) {
          if (k === 'textRaw' || k === 'name') w *= 30
          if (ok.indexOf(nw) == 0) w *= 40
          if (~ok.indexOf(nw + '(')) w *= 80
          if (o.methods) w *= 2
          w *= m
          if (o.name && o.desc) {
            ;(res[o.name] = res[o.name] || { o: o, w: w }), res[o.name].w += w
            traverseToTop(o, function (op) {
              if (op.name && op.desc) {
                w /= 10
                ;(res[op.name] = res[op.name] || { o: op, w: w }), res[op.name].w += w
              }
            })
          }
          m *= 30
        }
      })
    }
  }
  return res
}

function traverseToTop (o, fn) {
  if (o.parentNode) fn(o.parentNode), traverseToTop(o.parentNode, fn)
}

function toArray (o) {
  var res = []
  for (var k in o) o[k]._key = k, res.push(o[k])
  return res
}

function ByWeight (a, b) {
  return b.w - a.w
}

function toHtml (arr, h) {
  var h = h || 0
  var html = '<div>'
  arr.forEach(function (el) {
    var o = el.o || el
    html += '<div>'
    html += '<h' + (2 + h) + ' class="name">' + (o.textRaw || o.name) + '</h' + (2 + h) +'>'
    html += '<div class="desc">' + o.desc + '</div>'
    if (o.events) html += toHtml(o.events, h + 1)
    if (o.methods) html += toHtml(o.methods, h + 1)
    if (o.properties) html += toHtml(o.properties, h + 1)
    html += '</div>'
  })
  html += '</div>'
  return html
}

window.onload = function () {
  var search = document.getElementById('search')
  var output = document.getElementById('output')
  search.onkeyup = function (e) {
    var query = search.value
    var results = find(query, docs)
    results = toArray(results).sort(ByWeight).slice(0, 10)
    console.log(results)
    output.innerHTML = toHtml(results)
  }
}
