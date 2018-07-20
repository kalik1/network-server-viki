'use strict';

import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

const Schema = mongoose.Schema;

let DeviceSchema = new Schema({
        devEui : { type: String, minlength: 16, maxlength: 16, unique: true },
        devAddr : { type: String, minlength: 8, maxlength: 8, default:null },
        appKey : { type: String, minlength: 32, maxlength: 32 },
        nwkSKey : { type: String, minlength: 32, maxlength: 32 },
        appSKey : { type: String, minlength: 32, maxlength: 32 } ,
        nome : String,
        serialNumber : String,
        classe: String,
        note: {type: String },
        banda: {type: String, default: 'ITA863-870'},
        // application: /*String,*/ { type: Schema.ObjectId, ref: 'Application', required:true, autopopulate: {select: "nome appEui"} },
        // parser: /*String,*/ { type: Schema.ObjectId, ref: 'Parser',autopopulate: {select: "name"} },
        activationType: String,
        counterSize: { type: Number, min: 2, max: 4, default:4 },
        adr: { type : String, default : 'attivo'},
        dataSpeed: String,
        blockDownlink: { type :Boolean, default: false},
        /*user: String,*/
        // user: { type: Schema.ObjectId, ref: 'User', autopopulate: { select: 'username id' } },
        counterUp: { type: Number , min: 0, default: 0},
        counterDown: { type: Number , min: 0, default: 0},

    },
    {
        timestamps: true
    });

DeviceSchema.plugin(autopopulate);

export default mongoose.model('Device', DeviceSchema);