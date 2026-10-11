import AppKit
let img = NSImage(contentsOfFile: CommandLine.arguments[1])!
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
var i = 2
while i + 1 < CommandLine.arguments.count {
  let x = Int(CommandLine.arguments[i])!, y = Int(CommandLine.arguments[i+1])!
  let c = rep.colorAt(x: x, y: y)!.usingColorSpace(.sRGB)!
  print(String(format: "(%d,%d) #%02X%02X%02X a=%.2f", x, y, Int(c.redComponent*255), Int(c.greenComponent*255), Int(c.blueComponent*255), c.alphaComponent))
  i += 2
}
