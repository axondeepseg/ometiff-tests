import ExifReader from '../../bids-validator/node_modules/exifreader/dist/exif-reader.js'
import xml2js from '../../bids-validator/node_modules/xml2js/lib/xml2js.js'

function getExif() {
    const tags = ExifReader.load("test_image.ome.tif");
    return tags
}
getExif().then(function(result) {
    var xml = result['ImageDescription']['description']
    //console.log("\n OME-XML:", xml)
    

    var parseString = xml2js.parseString;

    parseString(xml, function (err, output) {
        //console.dir(output['OME']['Image'][0]['Pixels'][0]['$'])
        console.log("\nOME-TIFF metadata\n---------------------")
        console.log("PhysicalSizeX:", output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeX']);
        console.log("PhysicalSizeXUnit:", output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeXUnit']);
        console.log("PhysicalSizeY:", output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeY']);
        console.log("PhysicalSizeYUnit:", output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeYUnit']);
        console.log("PhysicalSizeZ:", output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeZ']);
        console.log("PhysicalSizeZUnit:", output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeZUnit']);
        console.log("DimensionOrder:", output['OME']['Image'][0]['Pixels'][0]['$']['DimensionOrder']);
    });
})

//fetch("test_image.json")
//  .then(response => response.json())
//  .then(json => console.log(json));