import ExifReader from '../../../../../../AppData/Roaming/npm/node_modules/exifreader/dist/exif-reader.js'
import xml2js from '../../../../../../AppData/Roaming/npm/node_modules/xml2js/lib/xml2js.js'

function getExif() {
    const tags = ExifReader.load("test_image.ome.tif");
    return tags
}
getExif().then(function(result) {
    var xml = result['ImageDescription']['description']
    console.log("\n OME-XML:", xml)
    

    var parseString = xml2js.parseString;

    parseString(xml, function (err, output) {
        console.dir(output['OME']['Image'][0]['Pixels'][0]['$']);
    });
})

