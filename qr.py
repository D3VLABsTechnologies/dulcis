import qrcode

url = 'http://192.168.114.64:3000'

qrcode.make(url).save("qrcode.png")

print("QR Code generated successfully!")

