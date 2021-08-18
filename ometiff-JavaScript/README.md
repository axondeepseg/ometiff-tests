# Instructions

ExifReader (https://github.com/mattiasw/ExifReader) is a JavaScript library used to read images metadata. To install it:
- Open your command window
- reach the directory `cd AppData\Roaming\npm\node_modules`
- Type `npm install exifreader --save`
- Type `npm install esm`<br>
`esm` stands for ES modules. It helps with the module importation and permits the use of the flag `-r esm`. Without it, we get a SyntaxError when running our test script.
- Choose a location on your computer to clone the *ometiff-tests* repo on AxonDeepSeg
- Right-click and select “Git Bash Here”
- In Git Bash, type `git clone git@github.com:axondeepseg/ometiff-tests.git`
- In your console, reach the directory where you cloned the ‘test_script.js’ with `cd`
- Type `node -r esm test_script.js`. All the tags of the *test_image.ome.tif* will appear in the console. 

