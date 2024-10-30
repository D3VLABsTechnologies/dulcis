import qrcode

url = 'http://172.20.10.4:3000'

qrcode.make(url).save("qrcode.png")

print("QR Code generated successfully!")

