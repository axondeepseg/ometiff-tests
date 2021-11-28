const ExifReader = require('exifreader')
const parseString = require('xml2js').parseString


function getExif() {
    const tags = ExifReader.load("test_image.ome.tif")
    return tags
}

function convertFactor(physicalSizeUnit) {
    if(physicalSizeUnit === 'mm') {
        return 1000
    }else if(physicalSizeUnit === 'um') {
        return 1
    }else if(physicalSizeUnit === 'nm') {
        return 0.001
    }
}

getExif().then(function(result) {
    var xml = result['ImageDescription']['description']
    //console.log("\n OME-XML:", xml)
    
    parseString(xml, function (err, output) {

        const physicalSizeX = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeX']
        const physicalSizeXUnit = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeXUnit']
        const physicalSizeY = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeY']
        const physicalSizeYUnit = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeYUnit']
        const physicalSizeZ = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeZ']
        const physicalSizeZUnit = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeZUnit']

        console.log("\nOME-TIFF metadata\n---------------------")
        console.log("PhysicalSizeX:", physicalSizeX)
        console.log("PhysicalSizeXUnit:", physicalSizeXUnit)
        console.log("PhysicalSizeY:", physicalSizeY)
        console.log("PhysicalSizeYUnit:", physicalSizeYUnit)
        console.log("PhysicalSizeZ:", physicalSizeZ)
        console.log("PhysicalSizeZUnit:", physicalSizeZUnit)
        console.log("DimensionOrder:", output['OME']['Image'][0]['Pixels'][0]['$']['DimensionOrder'])

        let factorX = convertFactor(physicalSizeXUnit);
        let factorY = convertFactor(physicalSizeYUnit);
        let factorZ = convertFactor(physicalSizeZUnit);
        let jsonData = require('./test_image.json')

        let pixelSize = jsonData['PixelSize']

        if (physicalSizeX * factorX !== pixelSize[0] || physicalSizeY * factorY !== pixelSize[1] || physicalSizeZ * factorZ !== pixelSize[2]) {
            console.log("PixelSize is not consistent with PhysicalSizeX, PhysicalSizeY and PhysicalSizeZ OME metadata fields")
        }else{
            console.log("PixelSize is consistent with PhysicalSizeX, PhysicalSizeY and PhysicalSizeZ OME metadata fields")
        }

    })
})
