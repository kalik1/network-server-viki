'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let AirDeviceSchema = new Schema({
        devEui : { type: String, minlength: 16, maxlength: 16, sparse: true, unique:true },

        devAddr : { type: String, minlength: 8, maxlength: 8, sparse: true, unique:true },
        recievedPackets : { type: Number, default: 1 },
        appEui : [{}],
        radio : {
            freq : [{}],
            datr : [{}],
            gateway : [{}]
        }
    },
    {
        timestamps: true
    });

AirDeviceSchema.index({
    gwMac: 'text',
    description: 'text',
    name: 'text'
});


export default mongoose.model('AirDevice', AirDeviceSchema);