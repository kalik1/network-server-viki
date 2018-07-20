'use strict';

/*import mongoose from 'mongoose';*/

import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

/*let User = require('../user/user.model.js');
let Gatewaytype = require('../gatewaytype/gatewaytype.model.js');*/
let Schema = mongoose.Schema;

let GatewaySchema = new Schema({
        name: String,
        gwMac: {type : String, uppercase : true, unique: true },
        info: String,
        active: Boolean,
        // user: { type: Schema.ObjectId, ref: 'User', autopopulate: { select: 'username' } },
        // gwType: { type: Schema.ObjectId, ref: 'Gatewaytype', autopopulate: { select: 'name antennas hasGps hasTemp hasAgent' } },
        // antennaTypes : [{ type: Schema.ObjectId, ref: 'Antennatype', autopopulate: true}],
        description: String,
        serial: String,
        pin: String,
        band: String,
        locked: { type: Boolean, default: false },
        shared: { type: Boolean, default: true },
        address: String,
        contact: String,
        tags: String,
        recievedPackets :  { type: Number, default: 1 },
        regione: { type: String, default: null},
        pos: {
            lat: String,
            lon: String,
            alti: String,
            dir: String,
        },
        planned: {type: Boolean, Default:"false"}
    },
    {
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

GatewaySchema.plugin(autopopulate);

GatewaySchema.index({
    gwMac: 'text',
    description: 'text',
    name: 'text'
});
//
// GatewaySchema
//     .path('gwMac')
//     .validate(function (gwMac) {
//         let passRegex = /^[0-9a-fA-F]{16}$/g;
//         return passRegex.test(gwMac);
//     }, 'Gateway EUI non valido');

/*
GatewaySchema
.virtual('antennaType', {
	ref: 'Antennatype',
	localField: 'antennaTypes',
	foreignField: '_id',
	justOne: false // for many-to-1 relationships,
});
*/


// GatewaySchema
// .path('gwMac')
// .validate(function (gwMac) {
// /*let mailRegex = /\S+@\S+\.\S+/;
// console.log("valid mail " + mailRegex.test(email));
// return mailRegex.test(email);*/

// if (gwMac.length != 16) return false;
// return true;
// }, 'Gateway MAC non valido');

//registerEvents(GatewaySchema);

export default mongoose.model('Gateway', GatewaySchema);
