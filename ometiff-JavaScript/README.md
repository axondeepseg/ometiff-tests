# Instructions

ExifReader (https://github.com/mattiasw/ExifReader) is a JavaScript library used to parse image files and extracts the metadata.

xml2js (https://github.com/Leonidas-from-XIV/node-xml2js) is a package that gives the ability to convert an XML to a JavaScript object. It will help to easily access the OME-TIFF metadata fields.

To install them
- Open your command window/terminal
- Reach the directory `cd ometiff-tests\ometiff-JavaScript`
- Type `npm install` to install exifreader and xml2js
- Type `node PixelSizeConsistency.js` to run the metadata read script.
The complete OME-XML of `test_image.ome.tif` will appear in the console, as well as the `<Image><Pixels>` fields. Those fields are interesting to validate the consistency of the PixelSize JSON field as well as its units (i.e. “um”).


