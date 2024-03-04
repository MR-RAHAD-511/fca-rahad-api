'use strict';
/* eslint-disable linebreak-style */
const utils = require('./utils');
global.Fca = new Object({
    isThread: new Array(),
    isUser: new Array(),
    startTime: Date.now(),
    Setting: new Map(),
    Version: require('./package.json').version,
    Require: new Object({
        fs: require("fs"),
        Fetch: require('got'),
        log: require("npmlog"),
        utils: require("./utils.js"),
        logger: require('./logger.js'),
        languageFile: require('./Language/index.json'),
        Security: require('./Extra/Src/uuid.js')
    }),
    getText: function(/** @type {any[]} */...Data) {
        var Main = (Data.splice(0,1)).toString();
            for (let i = 0; i < Data.length; i++) Main = Main.replace(RegExp(`%${i + 1}`, 'g'), Data[i]);
        return Main;
    },
    Data: new Object({
        ObjFastConfig: {
            "Language": "en",
            "PreKey": "",
            "AutoUpdate": true,
            "MainColor": "#9900FF",
            "MainName": "[  ]",
            "Uptime": false,
            "Config": "default",
            "DevMode": false,
            "Login2Fa": false,
            "AutoLogin": false,
            "BroadCast": true,
            "AuthString": "SD4S XQ32 O2JA WXB3 FUX2 OPJ7 Q7JZ 4R6Z | https://i.imgur.com/RAg3rvw.png Please remove this !, Recommend If You Using getUserInfoV2",
            "EncryptFeature": true,
            "ResetDataLogin": false,
            "AutoInstallNode": false,
            "AntiSendAppState": true,
            "AutoRestartMinutes": 0,
            "RestartMQTT_Minutes": 0,
            "Websocket_Extension": {
                "Status": false,
                "ResetData": false,
                "AppState_Path": "appstate.json"
            },
            "HTML": {   
                "HTML": true,
                "UserName": "Guest",
                "MusicLink": "https://drive.google.com/uc?id=1VwLO8C2Kelfyfteb9Hwnzls1p6CPtXuN&export=download"
            },
            "AntiGetInfo": {
                "Database_Type": "default", //json or default
                "AntiGetThreadInfo": true,
                "AntiGetUserInfo": true
            },
            "Stable_Version": {
                "Accept": false,
                "Version": ""
            }
        },
        CountTime: function() {
            var fs = global.Fca.Require.fs;
            if (fs.existsSync(__dirname + '/CountTime.json')) {
                try {
                    var data = Number(fs.readFileSync(__dirname + '/CountTime.json', 'utf8')),
                    hours = Math.floor(data / (60 * 60));
                }
                catch (e) {
                    fs.writeFileSync(__dirname + '/CountTime.json', 0);
                    hours = 0;
                }
            }
            else {
                hours = 0;
            }
            return `${hours} Hours`;
        }
    }),
    Action: function(Type) {
        switch (Type) {
            case "AutoLogin": {
                var Database = require('./Extra/Database');
                var logger = global.Fca.Require.logger;
                var Email = (Database().get('Account')).replace(RegExp('"', 'g'), ''); //hmm IDK
                var PassWord = (Database().get('Password')).replace(RegExp('"', 'g'), '');
                require('./Main')({ email: Email, password: PassWord},async (error, api) => {
                    if (error) {
                        logger.Error(JSON.stringify(error,null,2), function() { logger.Error("AutoLogin Failed!", function() { process.exit(0); }) });
                    }
                    try {
                        Database().set("TempState", Database().get('Through2Fa'));
                    }
                    catch(e) {
                        logger.Warning(global.Fca.Require.Language.Index.ErrDatabase);
                            logger.Error();
                        process.exit(0);
                    }
                    process.exit(1);
                });
            }
            break;
            default: {
                require('npmlog').Error("Invalid Message!");
            };
        }
    }
});

try {
    let Boolean_Fca = ["AntiSendAppState","AutoUpdate","Uptime","BroadCast","EncryptFeature","AutoLogin","ResetDataLogin","Login2Fa", "DevMode","AutoInstallNode"];
    let String_Fca = ["MainName","PreKey","Language","AuthString","Config"]
    let Number_Fca = ["AutoRestartMinutes","RestartMQTT_Minutes"];
    let Object_Fca = ["HTML","Stable_Version","AntiGetInfo","Websocket_Extension"];
    let All_Variable = Boolean_Fca.concat(String_Fca,Number_Fca,Object_Fca);


    if (!global.Fca.Require.fs.existsSync(process.cwd() + '/FastConfigFca.json')) {
        global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigFca.json", JSON.stringify(global.Fca.Data.ObjFastConfig, null, "\t"));
        process.exit(1);
    }

try {
    var Data_Setting = require(process.cwd() + "/FastConfigFca.json");
}
catch (e) {
    global.Fca.Require.logger.Error('Detect Your FastConfigFca Settings Invalid!, Carry out default restoration');
    global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigFca.json", JSON.stringify(global.Fca.Data.ObjFastConfig, null, "\t"));     
    process.exit(1)
}
    if (global.Fca.Require.fs.existsSync(process.cwd() + '/FastConfigFca.json')) {
        
        for (let i of All_Variable) {
            if (Data_Setting[i] == undefined) {
                Data_Setting[i] = global.Fca.Data.ObjFastConfig[i];
                global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigFca.json", JSON.stringify(Data_Setting, null, "\t"));
            }
            else continue; 
        } //Check Variable

        for (let i in Data_Setting) {
            if (Boolean_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(Data_Setting[i]) != "Boolean") logger.Error(i + " Is Not A Boolean, Need To Be true Or false !", function() { process.exit(0) });
                else continue;
            }
            else if (String_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(Data_Setting[i]) != "String") logger.Error(i + " Is Not A String, Need To Be String!", function() { process.exit(0) });
                else continue;
            }
            else if (Number_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(Data_Setting[i]) != "Number") logger.Error(i + " Is Not A Number, Need To Be Number !", function() { process.exit(0) });
                else continue;
            }
            else if (Object_Fca.includes(i)) {
                if (global.Fca.Require.utils.getType(Data_Setting[i]) != "Object") {
                    Data_Setting[i] = global.Fca.Data.ObjFastConfig[i];
                    global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigFca.json", JSON.stringify(Data_Setting, null, "\t"));
                }
                else continue;
            }
        }

        for (let i of Object_Fca) {
            const All_Paths = utils.getPaths(global.Fca.Data.ObjFastConfig[i]);
            const Mission = { Main_Path: i, Data_Path: All_Paths }
            for (let i of Mission.Data_Path) {
                if (Data_Setting[Mission.Main_Path] == undefined) {
                    Data_Setting[Mission.Main_Path] = global.Fca.Data.ObjFastConfig[Mission.Main_Path];
                    global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigFca.json", JSON.stringify(Data_Setting, null, "\t"));      
                }
                const User_Data = (utils.getData_Path(Data_Setting[Mission.Main_Path], i, 0))
                const User_Data_Type = utils.getType(User_Data);
                if (User_Data_Type == "Number") {
                    const Mission_Path = User_Data == 0 ? i : i.slice(0, User_Data); 
                    const Mission_Obj = utils.getData_Path(global.Fca.Data.ObjFastConfig[Mission.Main_Path], Mission_Path, 0);
                    Data_Setting[Mission.Main_Path] = utils.setData_Path(Data_Setting[Mission.Main_Path], Mission_Path, Mission_Obj)
                    global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigFca.json", JSON.stringify(Data_Setting, null, "\t"));      
                }
            }
        }

        if (!global.Fca.Require.languageFile.some((/** @type {{ Language: string; }} */i) => i.Language == Data_Setting.Language)) { 
            global.Fca.Require.logger.Warning("Not Support Language: " + Data_Setting.Language + " Only 'en' and 'vi'");
            process.exit(0); 
        }
        global.Fca.Require.Language = global.Fca.Require.languageFile.find((/** @type {{ Language: string; }} */i) => i.Language == Data_Setting.Language).Folder;
    } else process.exit(1);
    global.Fca.Require.FastConfig = Data_Setting;
}
catch (e) {
    console.log(e);
    global.Fca.Require.logger.Error();
}

// if (global.Fca.Require.FastConfig.Websocket_Extension.Status) {
//     console.history = new Array();
//     var Convert = require('ansi-to-html');
//     var convert = new Convert();
//     console.__log = console.log;
//     console.log = function (data) {
//         const log = convert.toHtml(data)
//         console.history.push(log)
//         console.__log.apply(console,arguments)
//         if (console.history.length > 80) {
//             console.history.shift();
//         }
//     }
// }

module.exports = function(loginData, options, callback) {
    const Language = global.Fca.Require.languageFile.find((/** @type {{ Language: string; }} */i) => i.Language == global.Fca.Require.FastConfig.Language).Folder.Index;
    const login = require('./Main');
    const fs = require('fs-extra');
    const got = require('got');
    const log = require('npmlog');
    const { execSync } = require('child_process');
    const Database = require('./Extra/Database');
    
    if (global.Fca.Require.FastConfig.DevMode) {
        require('./Extra/Src/Release_Memory');
    }
    
    return got.get('https://github.com/KanzuXHorizon/Global_Horizon/raw/main/InstantAction.json').then(async function(res) {
        if (global.Fca.Require.FastConfig.AutoInstallNode) {
            switch (fs.existsSync(process.cwd() + "/replit.nix") && process.env["REPL_ID"] != undefined) {
                case true: {
                    await require('./Extra/Src/Change_Environment.js')();
                    break;
                }
                case false: {
                    const NodeVersion = execSync('node -v').toString().replace(/(\r\n|\n|\r)/gm, "");
                    if (!NodeVersion.includes("v14") && !NodeVersion.includes("v16") && !Database(true).has('SkipReplitNix')) {
                        log.warn("[ rahad_remake-api_update ] •",global.Fca.getText(Language.NodeVersionNotSupported, NodeVersion));
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        try {
                            switch (process.platform) {
                                case "win32": {
                                    try {
                                    //check if user using nvm 
                                        if (fs.existsSync(process.env.APPDATA + "/nvm/nvm.exe")) {
                                            log.warn("[ rahad_remake-api_update ] •", Language.UsingNVM);
                                            process.exit(0);
                                        }
                                        //download NodeJS v14 for Windows and slient install
                                        await got('https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi').pipe(fs.createWriteStream(process.cwd() + "/node-v14.17.0-x64.msi"));
                                        log.info("[ rahad_remake-api_update ] •", Language.DownloadingNode);
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        execSync('msiexec /i node-v14.17.0-x64.msi /qn');
                                        log.info("[ rahad_remake-api_update ] •", Language.NodeDownloadingComplete);
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        log.info("[ rahad_remake-api_update ] •", Language.RestartRequire);
                                        Database(true).set("NeedRebuild", true);
                                        process.exit(0);
                                    }
                                    catch (e) {
                                        log.error("[ rahad_remake-api_update ] •",Language.ErrNodeDownload);
                                        process.exit(0);
                                    }
                                }
                                case "linux": {

                                    try {
                                        if (process.env["REPL_ID"] != undefined) {
                                            log.warn("[ rahad_remake-api_update ] •", "Look like you are using Replit, and didn't have replit.nix file in your project, i don't know how to help you, hmm i will help you pass this step, but you need to install NodeJS v14 by yourself, and restart your repl");
                                            Database(true).set('SkipReplitNix', true);
                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                            process.exit(1);
                                        }
                                            //check if user using nvm 
                                            if (fs.existsSync(process.env.HOME + "/.nvm/nvm.sh")) {
                                                log.warn("[ rahad_remake-api_update ] •", Language.UsingNVM);
                                                process.exit(0);
                                            }
                                            //download NodeJS v14 for Linux and slient install
                                            await got('https://nodejs.org/dist/v14.17.0/node-v14.17.0-linux-x64.tar.xz').pipe(fs.createWriteStream(process.cwd() + "/node-v14.17.0-linux-x64.tar.xz"));
                                            log.info("[ rahad_remake-api_update ] •", Language.DownloadingNode);
                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                            execSync('tar -xf node-v14.17.0-linux-x64.tar.xz');
                                            execSync('cd node-v14.17.0-linux-x64');
                                            execSync('sudo cp -R * /usr/local/');
                                            log.info("[ rahad_remake-api_update ] •", Language.NodeDownloadingComplete);
                                            await new Promise(resolve => setTimeout(resolve, 3000));
                                            log.info("[ rahad_remake-api_update ] •",Language.RestartingN);
                                            Database(true).set("NeedRebuild", true);
                                            process.exit(1);                                
                                        }
                                        catch (e) {
                                            log.error("[ rahad_remake-api_update ] •",Language.ErrNodeDownload);
                                            process.exit(0);
                                        }
                                }
                                case "darwin": {
                                    try {
                                        //check if user using nvm 
                                        if (fs.existsSync(process.env.HOME + "/.nvm/nvm.sh")) {
                                            log.warn("[ rahad_remake-api_update ] •", Language.UsingNVM);
                                            process.exit(0);
                                        }
                                        //download NodeJS v14 for MacOS and slient install
                                        await got('https://nodejs.org/dist/v14.17.0/node-v14.17.0-darwin-x64.tar.gz').pipe(fs.createWriteStream(process.cwd() + "/node-v14.17.0-darwin-x64.tar.gz"));
                                        log.info("[ rahad_remake-api_update ] •", Language.DownloadingNode);
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        execSync('tar -xf node-v14.17.0-darwin-x64.tar.gz');
                                        execSync('cd node-v14.17.0-darwin-x64');
                                        execSync('sudo cp -R * /usr/local/');
                                        log.info("[ rahad_remake-api_update ] •", Language.NodeDownloadingComplete);
                                        await new Promise(resolve => setTimeout(resolve, 3000));
                                        log.info("[ rahad_remake-api_update ] •",Language.RestartingN);
                                        Database(true).set("NeedRebuild", true);
                                        process.exit(1);
                                    }
                                    catch (e) {
                                        log.error("[ rahad_remake-api_update ] •",Language.ErrNodeDownload);
                                        process.exit(0);
                                    }
                                }
                            }
                        }
                        catch (e) {
                            console.log(e);
                            log.error("[ rahad_remake-api_update ] •","NodeJS v14 Installation Failed, Please Try Again and Contact fb.com/www.xnx.com9!");
                            process.exit(0);
                        }
                    }
                }
            }
        }
        if ((Database(true).get("NeedRebuild")) == true) {
            Database(true).set("NeedRebuild", false);
            log.info("[ rahad_remake-api_update ] •",Language.Rebuilding);
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                execSync('npm rebuild', {stdio: 'inherit'});
            }
            catch (e) {
                console.log(e);
                log.error("[ rahad_remake-api_update ] •",Language.ErrRebuilding);
            }
            log.info("[ rahad_remake-api_update ] •",Language.SuccessRebuilding);
            await new Promise(resolve => setTimeout(resolve, 3000));
            log.info("[ rahad_remake-api_update ] •",Language.RestartingN);
            process.exit(1);
        }

        let Data = JSON.parse(res.body);
            if (global.Fca.Require.FastConfig.Stable_Version.Accept == true) {
                if (Data.Stable_Version.Valid_Version.includes(global.Fca.Require.FastConfig.Stable_Version.Version)) {
                    let TimeStamp = Database(true).get('Check_Update');
                        if (TimeStamp == null || TimeStamp == undefined || Date.now() - TimeStamp > 300000) {
                            var Check_Update = require('./Extra/Src/Check_Update.js');
                        await Check_Update(global.Fca.Require.FastConfig.Stable_Version.Version);
                    }
                }
                else {
                    log.warn("[ rahad_remake-api_update ] •", "Error Stable Version, Please Check Your Stable Version in FastConfig.json, Automatically turn off Stable Version!");
                        global.Fca.Require.FastConfig.Stable_Version.Accept = false;
                        global.Fca.Require.fs.writeFileSync(process.cwd() + "/FastConfigRahad.json", JSON.stringify(global.Fca.Require.FastConfig, null, "\t"));
                    process.exit(1);
                }
            }
            else {
                if (Data.HasProblem == true || Data.ForceUpdate == true) {
                    let TimeStamp = Database(true).get('Instant_Update');
                        if (TimeStamp == null || TimeStamp == undefined || Date.now() - TimeStamp > 500) {
                            var Instant_Update = require('./Extra/Src/Instant_Update.js');
                        await Instant_Update()
                    }
                }
                else {
                    let TimeStamp = Database(true).get('Check_Update');
                        if (TimeStamp == null || TimeStamp == undefined || Date.now() - TimeStamp > 300000) {
                            var Check_Update = require('./Extra/Src/Check_Update.js');
                        await Check_Update()
                    } 
                }
            }
        return login(loginData, options, callback);
    }).catch(function(err) {
        console.log(err)
            log.error("[ rahad_remake-api_update ] •",Language.UnableToConnect);
            log.warn("[ rahad_remake-api_update ] •", "OFFLINE MODE ACTIVATED, PLEASE CHECK THE LATEST VERSION OF FCA BY CONTACT ME AT FB.COM/www.xnx.com9");
        return login(loginData, options, callback);
    });
};