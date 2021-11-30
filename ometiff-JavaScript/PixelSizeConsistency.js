const ExifReader = require('exifreader')
const parseString = require('xml2js').parseString

const validunits = ['um', 'nm', 'mm']

function getExif() {
    const tags = ExifReader.load("test_image.ome.tif")
    return tags
}

function convertFactor(fromUnit, toUnit) {
    if(!validunits.includes(fromUnit) || !validunits.includes(toUnit)){
        console.log('\x1b[31mWARNING: PixelSize consistency is only validated for "mm", "um" and "nm". PhysicalUnit in OME-TIFF is "%s", consistency check is skipped.\x1b[0m', fromUnit)
        process.exit(1)
    }

    if(fromUnit === toUnit) return 1

    if(toUnit === 'um'){
        if(fromUnit === 'mm') {
            return 1000
        }else if(fromUnit === 'nm') {
            return 0.001
        }
    }else if(toUnit === 'mm'){
        if(fromUnit === 'um') {
            return 0.001
        }else if(fromUnit === 'nm') {
            return 0.000001
        }
    }else if(toUnit === 'nm'){
        if(fromUnit === 'mm') {
            return 1000000
        }else if(fromUnit === 'um') {
            return 1000
        }
    }

}

getExif().then(function(result) {
    var xml = result['ImageDescription']['description']
    
    parseString(xml, function (err, output) {

        const physicalSizeX = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeX']
        const physicalSizeXUnit = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeXUnit']
        const physicalSizeY = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeY']
        const physicalSizeYUnit = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeYUnit']
        const physicalSizeZ = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeZ']
        const physicalSizeZUnit = output['OME']['Image'][0]['Pixels'][0]['$']['PhysicalSizeZUnit']

        console.log("\nOME-TIFF metadata")
        const metadata = {
            "PhysicalSizeX" : physicalSizeX,
            "PhysicalSizeXUnit" : physicalSizeXUnit,
            "PhysicalSizeY" : physicalSizeY,
            "PhysicalSizeYUnit" : physicalSizeYUnit,
            "PhysicalSizeZ" : physicalSizeZ,
            "PhysicalSizeZUnit" : physicalSizeZUnit,
            "DimensionOrder" : output['OME']['Image'][0]['Pixels'][0]['$']['DimensionOrder']
        }
        console.table(metadata)
        
        let jsonData = require('./test_image.json')
        let pixelSize = jsonData['PixelSize']
        let physicalSizeUnit = jsonData['PixelSizeUnits']

        let factorX = convertFactor(physicalSizeXUnit, physicalSizeUnit);
        let factorY = convertFactor(physicalSizeYUnit, physicalSizeUnit);
        let factorZ = convertFactor(physicalSizeZUnit, physicalSizeUnit);

        if (physicalSizeX * factorX !== pixelSize[0] || physicalSizeY * factorY !== pixelSize[1] || physicalSizeZ * factorZ !== pixelSize[2]) {
            console.log("\x1b[31m%s\x1b[0m", "PixelSize is not consistent with PhysicalSizeX, PhysicalSizeY and PhysicalSizeZ OME metadata fields")
            console.log("\x1b[31mpixelSize in JSON is %s, the converted physicalSize from OME-XML is [%s, %s, %s]\x1b[0m", pixelSize, physicalSizeX * factorX, physicalSizeY * factorY, physicalSizeZ * factorZ)
        }else{
            console.log("\x1b[36m%s\x1b[0m", "PixelSize is consistent with PhysicalSizeX, PhysicalSizeY and PhysicalSizeZ OME metadata fields")
        }

    })
})
