import QRCode from 'qrcode'

export const generateQRCode = async (url: string) => {
  try {
    return await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      scale: 10,
      margin: 0,
      width: 400,
    })
  } catch (err) {
    console.error(err)
  }
}
