We format self-written code (not imported librarys like bootstrap and jQuery):
* All code uses 4-space-indention.
* All python-files (*.py) are checked with the pep8-tool (ignoring E501 - line length).
* All JavaScript-files (*.js) are checked with jslint with --nomen, --forin, --vars.

You can easily ensure that the code satisfys this using a pre-commit-hook:

    #!/bin/bash

    # Check python-code for pep8-compatability
    find -name "*.py" | xargs pep8 --ignore=E501 || exit 1

    # Check js-code with jslint
    find -name "*.js" | grep -v "bootstrap" | grep -v "jquery" | xargs jslint --nomen --vars || exit 2


# Requirements:
	* PyYAML
	* mysql-connector-python
	* numpy
	* scipy
	* matplotlib
	* shutil
