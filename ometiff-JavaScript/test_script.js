import ExifReader from '../../../../../../AppData/Roaming/npm/node_modules/exifreader/dist/exif-reader.js'


function getExif() {
    const tags = ExifReader.load("test_image.ome.tif");
    return tags
}
getExif().then(function(result) {
    console.log(result)
})