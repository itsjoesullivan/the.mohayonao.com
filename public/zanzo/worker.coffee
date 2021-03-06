'use strict'

importScripts 'omggif.js'
importScripts '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js'

sum = (list)-> _.reduce list, ((a, b)-> a+ b), 0

draw = (src, dst, srcIndex, dstIndex)->
  dst[dstIndex++] = src[srcIndex++]
  dst[dstIndex++] = src[srcIndex++]
  dst[dstIndex++] = src[srcIndex++]
  dst[dstIndex++] = 255

overlay = (src, dst, srcIndex, dstIndex, opacity)->
  dst[dstIndex++] += Math.floor(src[srcIndex++] * opacity)
  dst[dstIndex++] += Math.floor(src[srcIndex++] * opacity)
  dst[dstIndex++] += Math.floor(src[srcIndex++] * opacity)
  dst[dstIndex++] = 255

copy = (src, dst)-> dst.set src


addEventListener 'message', (e)->
  reader = new GifReader(new Uint8Array(e.data))

  { width, height } = reader
  length = width * height * 4

  postMessage { type: 'info', args: [ reader.numFrames(), width, height ] }

  frames = _.range(reader.numFrames()).map (index)->
    frame = reader.frameInfo index
    frame.delay = Math.max(1, frame.delay)
    frame.index = index
    frame

  totalDelay = sum _.pluck frames, 'delay'

  interlace = new Uint16Array(_.flatten [
    _.range(0, height, 8)
    _.range(4, height, 8)
    _.range(2, height, 4)
    _.range(1, height, 2)
  ])

  canvas = new Uint8Array(length)
  result = new Uint8Array(length)

  process = (tmp, opacity, ymap)->
    for y in [0...height] by 1
      srcIndex = y * width * 4
      dstIndex = ymap(y) * width * 4

      for x in [0...width] by 1
        if tmp[srcIndex + 3] isnt 0
          draw(tmp, canvas, srcIndex, srcIndex)

        overlay(canvas, result, srcIndex, dstIndex, opacity)

        srcIndex += 4
        dstIndex += 4

    null

  loopFunc = ->
    frame   = frames.shift()
    opacity = frame.delay / totalDelay
    ymap    = if frame.interlaced then (y)-> interlace[y] else _.identity

    tmp = new Uint8Array(length)
    reader.decodeAndBlitFrameRGBA frame.index, tmp

    process(tmp, opacity, ymap)

    copy(result, tmp)
    postMessage { type: 'progress', args: [ tmp, frame.index ] }, [ tmp.buffer ]

    if frames.length isnt 0
      setTimeout loopFunc, 0
    else
      postMessage { type: 'result', args: [ result ] }, [ result.buffer ]

  do loopFunc
