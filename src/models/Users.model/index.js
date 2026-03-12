const mongoose = require("mongoose");
const Float = mongoose.Decimal128;
const {decimalCall, getMoney, generatePin, generate, intHolderSchema, decimalCall2} = require("./../mongoFuncs");
const UsersSchema = new mongoose.Schema(
    {
        decimalID: Number,
        personal: {
            name: {type: String, required: true},
            last_name: {type: String, required: false},
            nickname: {type: String, unique: true, required: true,},
        },
        finance: {
            balance: {type: Float,default: 0,get: getMoney,set: getMoney},
        },
        filters: {
            games: {
                live: {
                    active : {type: Boolean, default: true},
                    ratio : {type: Float, get: getMoney, default: 0},
                    cashout : {type: Array, default:null},
                    isCashOutActive :  {type: Boolean, default: true},
                },
                prematch: {
                    active : {type: Boolean, default: true},
                    ratio : {type: Float, get: getMoney, default: 0},
                    cashout : {type: Array, default:null},
                    isCashOutActive :  {type: Boolean, default: true},
                },
                casino: {
                    active : {type: Boolean, default: true},
                    ratio : {type: Float, get: getMoney, default: 0},
                    disableGames: {type: Array, default: []},
                },
                slot: {
                    active : {type: Boolean, default: true},
                    ratio : {type: Float, get: getMoney, default: 0},
                    bankGroupId : {type: String, default: "default_bank"},
                    patchId : {type: String, default: "default_patch"},
                    disableGames: {type: Array, default: []},
                    slotCurrency : {type: String, default: "CHF"},
                },
                poker: {
                    active : {type: Boolean, default: true},
                    ratio : {type: Float, get: getMoney, default: 0},
                    disableGames: {type: Array, default: []},
                },
                bingo: {
                    active : {type: Boolean, default: true},
                    ratio : {type: Float, get: getMoney, default: 0},
                    disableGames: {type: Array, default: []},
                },
            }
        },
    }, {
        toObject: {getters: true},
        toJSON: {getters: true}
    });


module.exports = mongoose.model('users', UsersSchema);
