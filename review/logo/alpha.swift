import AppKit
// white-on-teal raster -> white with alpha (alpha from red channel, teal has R=0), cropped to content
let src = NSImage(contentsOfFile: CommandLine.arguments[1])!
let rep = NSBitmapImageRep(data: src.tiffRepresentation!)!
let w = rep.pixelsWide, h = rep.pixelsHigh
var minX = w, minY = h, maxX = 0, maxY = 0
var alphas = [UInt8](repeating: 0, count: w*h)
for y in 0..<h { for x in 0..<w {
  let c = rep.colorAt(x: x, y: y)!.usingColorSpace(.sRGB)!
  let a = UInt8(max(0, min(255, (c.redComponent) * 255)))
  alphas[y*w+x] = a
  if a > 120 && x > 4 && y > 4 && x < w-5 && y < h-5 { minX = min(minX,x); maxX = max(maxX,x); minY = min(minY,y); maxY = max(maxY,y) }
}}
let pad = 8
minX = max(0,minX-pad); minY = max(0,minY-pad); maxX = min(w-1,maxX+pad); maxY = min(h-1,maxY+pad)
let cw = maxX-minX+1, ch = maxY-minY+1
let out = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: cw, pixelsHigh: ch, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: cw*4, bitsPerPixel: 32)!
let p = out.bitmapData!
for y in 0..<ch { for x in 0..<cw {
  let a = alphas[(y+minY)*w + (x+minX)]
  let i = (y*cw+x)*4
  // premultiplied white
  p[i] = a; p[i+1] = a; p[i+2] = a; p[i+3] = a
}}
try! out.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: CommandLine.arguments[2]))
print("crop \(minX),\(minY) \(cw)x\(ch)")
