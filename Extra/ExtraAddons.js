'use strict';

var utils = require('../utils');
var logger = require('../logger')
var OTP = require('totp-generator');

module.exports.getInfo = async function (id,jar,ctx,defaultFuncs) {
    var AccessToken = await module.exports.getAccessToken(jar,ctx,defaultFuncs);
    var { body:Data } = await utils.get(`https://graph.facebook.com/${id}?fields=age_range,picture,cover,name,first_name,email,about,birthday,gender,website,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limite(0)&access_token=${AccessToken}`,jar,null,ctx.globalOptions);
    var Format = {
        id: JSON.parse(Data).id || "No data",
        name: JSON.parse(Data).name || "No data",
        first_name: JSON.parse(Data).first_name || "No data",
        username: JSON.parse(Data).username || "No data",
        link: JSON.parse(Data).link || "No data",
        verified: JSON.parse(Data).verified || "No data",
        about: JSON.parse(Data).about || "No data",
        avatar: JSON.parse(Data).picture.data.url || "No data",
        cover: JSON.parse(Data).cover.source || "No data",
        birthday: JSON.parse(Data).birthday || "No data",
        age: JSON.parse(Data).age_range.min || "No data",
        follow: JSON.parse(Data).subscribers.summary.total_count || "No data",
        gender: JSON.parse(Data).gender || "No data",
        hometown: JSON.parse(Data).hometown || "No data",
        email: JSON.parse(Data).email || "No data",
        interested_in: JSON.parse(Data).interested_in || "No data",
        location: JSON.parse(Data).location || "No data",
        locale: JSON.parse(Data).locale || "No data",
        relationship_status: JSON.parse(Data).relationship_status || "No data",
        love: JSON.parse(Data).significant_other || "No data",
        website: JSON.parse(Data).website || "No data",
        quotes: JSON.parse(Data).quotes || "No data",
        timezone: JSON.parse(Data).timezone || "No data",
        updated_time: JSON.parse(Data).updated_time || "No data"
    }
    return Format;
}

/**
 * Help: @ManhG
 * Author: @KanzuWakazaki
*/

module.exports.getAccessToken = async function (jar, ctx,defaultFuncs) {
    if (global.Fca.Data.AccessToken) {
        return global.Fca.Data.AccessToken;
    }
    else {
        var nextURLS = "https://business.facebook.com/security/twofactor/reauth/enter/"
        return defaultFuncs.get('https://business.facebook.com/content_management', jar, null, ctx.globalOptions).then(async function(data) {
            try {
                if (/"],\["(.*?)","/.exec(/LMBootstrapper(.*?){"__m":"LMBootstrapper"}/.exec(data.body)[1])[1])  {
                    global.Fca.Data.AccessToken = /"],\["(.*?)","/.exec(/LMBootstrapper(.*?){"__m":"LMBootstrapper"}/.exec(data.body)[1])[1];
                    return /"],\["(.*?)","/.exec(/LMBootstrapper(.*?){"__m":"LMBootstrapper"}/.exec(data.body)[1])[1];
                }
            }
            catch (_) {
                if (global.Fca.Require.FastConfig.AuthString.includes('|')) return logger.Error(global.Fca.Require.Language.Index.Missing)
                var OPTCODE = global.Fca.Require.FastConfig.AuthString.includes(" ") ? global.Fca.Require.FastConfig.AuthString.replace(RegExp(" ", 'g'), "") : global.Fca.Require.FastConfig.AuthString;
                var Form = { 
                    approvals_code: OTP(String(OPTCODE)),
                    save_device: false,
                    lsd: utils.getFrom(data.body, "[\"LSD\",[],{\"token\":\"", "\"}")
                }
                return defaultFuncs.post(nextURLS, jar, Form, ctx.globalOptions, { 
                    referer: "https://business.facebook.com/security/twofactor/reauth/?twofac_next=https%3A%2F%2Fbusiness.facebook.com%2Fcontent_management&type=avoid_bypass&app_id=0&save_device=0",
                }).then(async function(dataa) {
                    if (String(dataa.body).includes(false)) throw { Error: "Invaild OTP | FastConfigFca.json: AuthString" }
                    return utils.get('https://business.facebook.com/content_management', jar, null, ctx.globalOptions,{ 
                        referer: "https://business.facebook.com/security/twofactor/reauth/?twofac_next=https%3A%2F%2Fbusiness.facebook.com%2Fcontent_management&type=avoid_bypass&app_id=0&save_device=0",
                    }).then(async function(data) {
                        var Access_Token = /"],\["(.*?)","/.exec(/BusinessToolEmptyView.brands.react(.*?){"__m":"BusinessToolEmptyView.brands.react"}/.exec(data.body)[1])[1];
                        global.Fca.Data.AccessToken = Access_Token;
                        return Access_Token;
                    });
                });
            }
        })
    }
}

//hard working =))