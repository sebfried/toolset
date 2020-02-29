const fs = require("fs")
const pathModule = require("path")

const jsDest = "output/"
const coffeeSource = "sources/source/*/*.coffee"

//shellscrip paths
const copyScript = "sources/ressources/copyscript.sh"

const base = "toolset/thingy-build-system/cli/"
const updatePackagesScript = base + "update-packages.sh"
const publishScript = base + "publish-on-npm.sh"
const cleanPackageScript = base + "clean-package.sh"
const installNodeModulesScript = base + "install-node-modules.sh"
const prependShebangScript = base + "prepend-shebang-to-output-index.sh"

var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    type: "cli",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns build",
            
            // overwrite the general base stuff
            "build-coffee": "coffee -o " + jsDest + " -c " + coffeeSource,
            "watch-coffee": "coffee -o " + jsDest + " -cw " + coffeeSource,
            "sync-allmodules": "thingy-allmodules-sync --style require",

            //For testing and building
            // "test": "run-s -ns build watch",
            "build": "run-s -ns clean-package build-coffee copyscript install-node-modules prepend-shebang",
            "watch": "run-p -nsr watch-coffee",
            
            //for release
            "release": "run-s -ns build publish-script",

            // shellscripts to be called
            "update-cli-packages": updatePackagesScript,
            "prepend-shebang": prependShebangScript,
            "publish-script": publishScript,
            "clean-package": cleanPackageScript,
            "install-node-modules": installNodeModulesScript,
            "copyscript": copyScript
        }
    },
    getDependencies: () => {
        
        var thingyDeps = { }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps

    },
    produceConfigFiles: (projectRoot) => {
        return
    }
}