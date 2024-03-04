/* eslint-disable */
"use strict";
var Database= require("./Database");
const { lastRun,capture } = require('./Src/Last-Run');
const logger = require("../logger");
const getText = global.Fca.getText;
var language = require("../Language/index.json");
const fs = require("fs");
language = language.find(i => i.Language == require(process.cwd() + "/FastConfigRahad.json").Language).Folder.ExtraGetThread;

if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
    if (!fs.existsSync(process.cwd() + "/RAHAD_Database/Threads.json")) {
        fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify({}));
    }
}
else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type != "default" && global.Fca.Require.FastConfig.AntiGetInfo.Database_Type != "json") {
    logger.Warning("Database_Type in FastConfigRahad.json is not valid. Only default and json are valid.");
    process.exit(0);
}

exports.createData = function(threadID,threadData) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        try { 
            Database(true).set(String(threadID),Object(threadData));
            logger.Normal(getText(language.CreateDatabaseSuccess,String(threadID)));
        }
        catch (e) {
            console.log(e);
            logger.Warning(getText(language.CreateDatabaseFailure,String(threadID))); 
        }
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            try {
                var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            }
            catch (e) {
                var data = {};
                fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify(data));
            }
            
            data[String(threadID)] = Object(threadData);
            fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify(data));
            logger.Normal(getText(language.CreateDatabaseSuccess,String(threadID)));
        }
        catch (e) {
            console.log(e);
            logger.Warning(getText(language.CreateDatabaseFailure,String(threadID))); 
        }
    }
}

exports.updateData = function(threadID,threadData) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        try { 
            Database(true).set(String(threadID),Object(threadData));
            logger.Normal(getText(language.updateDataSuccess,String(threadID)));
        }
        catch (e) {
            console.log(e);
            logger.Warning(getText(language.updateDataFailure,String(threadID))); 
        }
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            try {
                var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            }
            catch (e) {
                var data = {};
                fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify(data));
            }
            
            data[String(threadID)] = Object(threadData);
            fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify(data));
            logger.Normal(getText(language.updateDataSuccess,String(threadID)));
        }
        catch (e) {
            console.log(e);
            logger.Warning(getText(language.updateDataFailure,String(threadID))); 
        }
    }
}

exports.updateMessageCount = function(threadID,threadData) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        try { 
            Database(true).set(String(threadID),Object(threadData));
        }
        catch (e) {
            console.log(e);
        }
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            try {
                var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            }
            catch (e) {
                var data = {};
                fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify(data));
            }
            
            data[String(threadID)] = Object(threadData);
            fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify(data));
        }
        catch (e) {
            console.log(e);
        }
    }
}

exports.getData = function(threadID) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        switch (Database(true).has(String(threadID))) {
            case true: {
                return Database(true).get(String(threadID))
            }
            case false: {
                return null;
            }
        }
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            switch (data.hasOwnProperty(String(threadID))) {
                case true: {
                    return data[String(threadID)];
                }
                case false: {
                    return null;
                }
            }
        }
        catch (e) {
            console.log(e);
            return null;
        }
    }
}

exports.deleteAll = function(data) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        for (let i of data) {
            Database(true).delete(String(i));
        }
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            var data1 = require(process.cwd() + "/RAHAD_Database/Threads.json");
            for (let i of data) {
                delete data1[String(i)];
            }
            fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify(data1));
        }
        catch (e) {
            console.log(e);
        }
    }
}

exports.getAll = function() {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        return Database(true).list();
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            const Data_Res = []
            var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            for (let i of Object.keys(data)) {
                Data_Res.push({
                    ID: String(i),
                    data: data[String(i)]
                });
            }
            return Data_Res;
        }
        catch (e) {
            console.log(e);
            return [];
        }
    }
}

exports.hasData = function(threadID) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        return Database(true).has(String(threadID));
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            return data.hasOwnProperty(String(threadID));
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}

exports.alreadyUpdate = function(threadID) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        var Time = Database(true).get(String(threadID)).TimeUpdate;
            try { 
                if (global.Fca.startTime >= (Time + (3600 * 1000))) {
                    logger.Normal(getText(language.alreadyUpdate, String(threadID)));
                    return true;
                }
                else return false;
            }
            catch (e) { 
                console.log(e);
            return true;
        }
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            var Time = data[String(threadID)].TimeUpdate;
            try { 
                if (global.Fca.startTime >= (Time + (3600 * 1000))) {
                    logger.Normal(getText(language.alreadyUpdate, String(threadID)));
                    return true;
                }
                else return false;
            }
            catch (e) { 
                console.log(e);
            return true;
        }
        }
        catch (e) {
            console.log(e);
            return true;
        }
    }
}

exports.readyCreate = function(Name) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        switch (Database(true).has(String(Name))) {
            case true: {
                if (Number(global.Fca.startTime) >= Number(Database(true).get(String(Name)) + (120 * 1000))) {
                    return true;
                }   
                else {
                    return false;
                }
            }
            case false: {
                return false;
            }
        }
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            switch (data.hasOwnProperty(String(Name))) {
                case true: {
                    if (Number(global.Fca.startTime) >= Number(data[String(Name)] + (120 * 1000))) {
                        return true;
                    }   
                    else {
                        return false;
                    }
                }
                case false: {
                    return false;
                }
            }
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}

exports.setLastRun = function(Name,LastRun) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        Database(true).set(String(Name),String(lastRun(LastRun)));
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            data[String(Name)] = String(lastRun(LastRun));
            fs.writeFileSync(process.cwd() + "/RAHAD_Database/Threads.json",JSON.stringify(data));
        }
        catch (e) {
            console.log(e);
        }
    }
}

exports.getLastRun = function(Name) {
    if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "default") {
        switch (Database(true).has(String(Name))) {
            case true: {
                return Database(true).get(String(Name));
            }
            case false: {
                try {
                    capture(Name)
                    this.setLastRun(Name,Name);
                    return Database(true).get(String(Name));
                }
                catch(e) {
                    console.log(e);
                    return Date.now();
                }
            }
        }
    }
    else if (global.Fca.Require.FastConfig.AntiGetInfo.Database_Type == "json") {
        try {
            var data = require(process.cwd() + "/RAHAD_Database/Threads.json");
            switch (data.hasOwnProperty(String(Name))) {
                case true: {
                    return data[String(Name)];
                }
                case false: {
                    try {
                        capture(Name)
                        this.setLastRun(Name,Name);
                        return data[String(Name)];
                    }
                    catch(e) {
                        console.log(e);
                        return Date.now();
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
            return Date.now();
        }
    }
}