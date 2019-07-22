const fs = require("fs")
const pathModule = require("path")

const servicePath = "output/service.js"

const webpackConfig = "webpack.config.js"
const webpackWatchConfig = "webpack-watch.config.js"

//shellscrip paths
const patchScript = "sources/patches/patch-stuff.sh"
const copyScript = "sources/ressources/copyscript.sh"

const toolsetWebsiteBase = "toolset/thingy-build-system/website/"
const createFoldersScript = toolsetWebsiteBase + "create-compile-folders.sh" 
const pushScript = toolsetWebsiteBase + "add-commit-and-push-all-repos.sh"
const pullScript = toolsetWebsiteBase + "pull-all.sh" 


var sourceInfo = null
try {
    sourceInfo = require("./sourceInfo")
} catch(err) { 
    console.log(err.message)
}

// console.log("sourceInfo is: " + sourceInfo)

module.exports = {
    type: "service",
    getScripts: () => {
        return {
            //general Base expects this script and calls it on postinstall
            "initialize-thingy": "run-s -ns patch-stuff create-compile-folders copyscript build",

            
            "bundle": "webpack-cli --config " + webpackConfig,
            "watch-bundle": "webpack-cli --config " + webpackWatchConfig,

            "watch-service": "nodemon " + servicePath,

            //For testing and building
            "test": "run-s -ns build watch",
            "build": "run-s -ns build-coffee bundle",
            "watch": "run-p -nsr watch-coffee watch-bundle watch-service",
            
            // shellscripts to be called
            "create-compile-folders": createFoldersScript,            
            "patch-stuff": patchScript,
            "copyscript": copyScript,
            "push": pushScript,
            "pull": pullScript    
        }
    },
    getDependencies: () => {
        
        var thingyDeps = {
            "nodemon": "^1.18.0",
            "webpack": "^4.29.0",
            "webpack-cli": "^3.2.1"
        }

        if(sourceInfo) {
            Object.assign(thingyDeps, sourceInfo.getDependencies())
        }
        return thingyDeps

    },
    produceConfigFiles: (projectRoot) => {
        const exportsString = "module.exports = "
        

        const webpackConfigObject = {
            mode: "production",
            devtool: "none",
            entry: pathModule.resolve(projectRoot, "toolset/compiled/js/index.js"),
            output: {
                filename: 'service.js',
                path: pathModule.resolve(projectRoot, 'output/')
            }
        }
        
        const configString = exportsString + JSON.stringify(webpackConfigObject, null, 4)
        webpackConfigObject.watch = true

        const watchConfigString = exportsString + JSON.stringify(webpackConfigObject, null, 4)
        const configPath = pathModule.resolve(projectRoot, webpackConfig)
        const watchConfigPath = pathModule.resolve(projectRoot, webpackWatchConfig)

        // console.log("\nWebpack config path: " + configPath)
        // console.log(configString)
        // console.log("\nWebpack watch config path: " + watchConfigPath)
        // console.log(watchConfigString)
        fs.writeFileSync(configPath, configString)
        fs.writeFileSync(watchConfigPath, watchConfigString)
    }
}