# Instructions

ExifReader (https://github.com/mattiasw/ExifReader) is a JavaScript library used to read images metadata. To install it:
- Open your command window
- Reach the directory `cd bids-validator\node_modules`
- Type `npm install exifreader --save`
- Type `npm install esm`<br>
`esm` stands for EcmaScript Modules. It helps with the module importation and permits the use of the flag `-r esm`. Without it, we get a SyntaxError when running our test script.
- Type `npm install xml2js`
xml2js is a package that gives the ability to convert a XML to a JavaScript object. It will help to easily access the OME-TIFF metadata fields.
- With the command `cd` in your console, reach the folder where the metadata read script is (`C:\Users\<my_user>\ometiff-tests\ometiff-JavaScript`)
- Type `node -r esm PixelSizeConsistency.js` 
The complete OME-XML of ‘test_image.ome.tif’ will appear in the console, as well as the `<Image><Pixels>` fields. Those fields are interesting to validate the consistency of the PixelSize JSON field as well as its units (i.e. “um”).


