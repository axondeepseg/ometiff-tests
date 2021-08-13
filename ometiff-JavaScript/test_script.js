import ExifReader from '../../../../../../AppData/Roaming/npm/node_modules/exifreader/dist/exif-reader.js'


function getExif() {
    const tags = ExifReader.load("test_image.ome.tif");
    return tags
}
getExif().then(function(result) {
    console.log(result)
    console.log("ImageWidth:", result['ImageWidth'])
    console.log("ImageLength:", result['ImageLength'])
    console.log("XResolution:", result['XResolution'])
    console.log("YResolution:", result['YResolution'])
    console.log("ResolutionUnit:", result['ResolutionUnit'])
})