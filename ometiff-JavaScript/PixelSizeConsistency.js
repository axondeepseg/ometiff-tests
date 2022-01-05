const ExifReader = require('exifreader')
const parseString = require('xml2js').parseString

const validUnitsInOME = ['µm', 'nm', 'mm']
const validUnitsInJSON = ['um', 'nm', 'mm']

function getExif() {
    const tags = ExifReader.load("test_image.ome.tif")
    return tags
}

function convertFactor(omeUnit, jsonUnit) {
    if(!validUnitsInOME.includes(omeUnit)){
        console.log('\x1b[31mERROR: PixelSize consistency is only validated for "mm", "µm" and "nm". PhysicalUnit in OME-TIFF is "%s", consistency check is skipped.\x1b[0m', omeUnit)
        process.exit(1)
    }else if(!validUnitsInJSON.includes(jsonUnit)) {
        console.log('\x1b[31mERROR: PixelSize consistency is only validated for "mm", "um" and "nm". PixelSizeUnits in JSON is "%s", consistency check is skipped.\x1b[0m', jsonUnit)
        process.exit(1)
    }

    if(omeUnit === jsonUnit || (omeUnit === 'µm' && jsonUnit === 'um')) return 1

    if(jsonUnit === 'um'){
        if(omeUnit === 'mm') {
            return 1000
        }else if(omeUnit === 'nm') {
            return 0.001
        }
    }else if(jsonUnit === 'mm'){
        if(omeUnit === 'µm') {
            return 0.001
        }else if(omeUnit === 'nm') {
            return 0.000001
        }
    }else if(jsonUnit === 'nm'){
        if(omeUnit === 'mm') {
            return 1000000
        }else if(omeUnit === 'um') {
            return 1000
        }
    }

}

getExif().then(function(result) {
    var xml = result['ImageDescription']['description']
    
    parseString(xml, function (err, output) {

        let rootKey = Object.keys(output)[0]
        let namespace = ''
        if (rootKey.includes(':')) {
          namespace = rootKey.split(':')[0].concat(':')
        }

        const physicalSizeX = output[`${namespace}OME`][`${namespace}Image`][0][`${namespace}Pixels`][0]['$']['PhysicalSizeX']
        const physicalSizeXUnit = output[`${namespace}OME`][`${namespace}Image`][0][`${namespace}Pixels`][0]['$']['PhysicalSizeXUnit']
        const physicalSizeY = output[`${namespace}OME`][`${namespace}Image`][0][`${namespace}Pixels`][0]['$']['PhysicalSizeY']
        const physicalSizeYUnit = output[`${namespace}OME`][`${namespace}Image`][0][`${namespace}Pixels`][0]['$']['PhysicalSizeYUnit']
        const physicalSizeZ = output[`${namespace}OME`][`${namespace}Image`][0][`${namespace}Pixels`][0]['$']['PhysicalSizeZ']
        const physicalSizeZUnit = output[`${namespace}OME`][`${namespace}Image`][0][`${namespace}Pixels`][0]['$']['PhysicalSizeZUnit']

        console.log("\nOME-TIFF metadata")
        const metadata = {
            "PhysicalSizeX" : physicalSizeX,
            "PhysicalSizeXUnit" : physicalSizeXUnit,
            "PhysicalSizeY" : physicalSizeY,
            "PhysicalSizeYUnit" : physicalSizeYUnit,
            "PhysicalSizeZ" : physicalSizeZ,
            "PhysicalSizeZUnit" : physicalSizeZUnit,
            "DimensionOrder" : output[`${namespace}OME`][`${namespace}Image`][0][`${namespace}Pixels`][0]['$']['DimensionOrder'],
        }
        console.table(metadata)
        
        let jsonData = require('./test_image.json')

        let pixelSize = jsonData['PixelSize']
        let physicalSizeUnit = jsonData['PixelSizeUnits']

        let factorX = convertFactor(physicalSizeXUnit, physicalSizeUnit);
        let factorY = convertFactor(physicalSizeYUnit, physicalSizeUnit);
        let factorZ = convertFactor(physicalSizeZUnit, physicalSizeUnit);


        // physicalSizeUnit consistency check
        if (physicalSizeX * factorX !== pixelSize[0] || physicalSizeY * factorY !== pixelSize[1] || physicalSizeZ * factorZ !== pixelSize[2]) {
            console.log("\x1b[31m%s\x1b[0m", "PixelSize is not consistent with PhysicalSizeX, PhysicalSizeY and PhysicalSizeZ OME metadata fields")
            console.log("\x1b[31mpixelSize in JSON is %s, the converted physicalSize from OME-XML is [%s, %s, %s]\x1b[0m", pixelSize, physicalSizeX * factorX, physicalSizeY * factorY, physicalSizeZ * factorZ)
        }else{
            console.log("\x1b[36m%s\x1b[0m", "PixelSize is consistent with PhysicalSizeX, PhysicalSizeY and PhysicalSizeZ OME metadata fields")
        }


        // optional fields consistency check
        let fields = {'Immersion': 'Immersion', 'NumericalAperture': 'LensNA', 'Magnification': 'NominalMagnification'}

        if(output[`${namespace}OME`][`${namespace}Instrument`] && output[`${namespace}OME`][`${namespace}Instrument`][0][`${namespace}Objective`]){
            let objective = output[`${namespace}OME`][`${namespace}Instrument`][0][`${namespace}Objective`][0]['$']

            for(let field in fields) {
                if(jsonData[field] && !objective[fields[field]]){
                    console.log("\x1b[31mOptional Field %s is present in the JSON file but not found the corresponding field %s in the OME file\x1b[0m", field, fields[field], )
                }else if(jsonData[field] && objective[fields[field]]){
                    if(jsonData[field] != objective[fields[field]]){
                        console.log("\x1b[31mOptional Field '%s' is %s in the JSON file but %s in the OME file\x1b[0m", field, jsonData[field], objective[fields[field]])
                    } else{
                        console.log("\x1b[36mOptional Field '%s' in the JSON file is consistent with '%s' in the OME file\x1b[0m", field, fields[field])
                    }
                }
            }
        }
        
    })
})
