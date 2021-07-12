# ometiff-tests
This repository contains the files used to test OME-TIFF images for BIDS-microscopy. The NDPI and the TIFF files are from Osvaldo Delbono’s dataset. The test OME-TIFF is a sample data from https://docs.openmicroscopy.org/ome-model/5.6.3/ome-tiff/data.html.

## Python packages installation
The following procedure describes how to install the Python packages used for the ometiff-tests notebook. These packages are useful to read, write OME-TIFF and convert different types of file to OME-TIFF.

### 1. Install the Python package tifffile
- Open the Anaconda Prompt
- Type in the following line :	`pip install tifffile`
- The documentation relative to this package can be found here: https://github.com/cgohlke/tifffile

### 2. Install the library libvips
- Open the Anaconda Prompt
- Type in the following line :	`pip install pyvips`
- *pyvips* is the Python binding for *libvips*. The documentation can be found here: https://libvips.github.io/pyvips/index.html
- Download the file **vips-dev-w64-web-X.Y.Z.zip** from the latest release here: https://github.com/libvips/build-win64-mxe/releases
- Extract the **.zip** file somewhere on your Local Disk (C:). You should get the folder **vips-dev-X.Y**, where **X.Y** is the release version (ex: **8.11**).

### 3. Import the packages in Python
- Open the Python file you’re working on in your code editor (ex: VS Code)
- For *tifffile*, simply incorporate `import tifffile` in your code
- For *libvips*, add the lines:
```
from ctypes import *
cdll.LoadLibrary("C:/.../vips-dev-X.Y/bin/libgobject-2.0-0.dll")
cdll.LoadLibrary("C:/.../vips-dev-X.Y/bin/libvips-42.dll")
import pyvips
```
Where `C:/.../vips-dev-X.Y` represents the path to where you saved the previous folder (see above). Without the three lines before `import pyvips`, you may get an **OSError** because the libraries can’t be found.

*Tested with Visual Studio Code 1.57.1 with Python 3.9.2 on Windows10*
