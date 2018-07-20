import config from './config'

import redis from 'redis';
import mongoose from 'mongoose';
import elasticsearch from 'elasticsearch';

import Gateway from './models/gateway.model'
import Device from './models/device.model'
import DevicePacket from './models/devicepackets.model'
import AirDevice from './models/airdevice.model'
import lora_packet from 'lora-packet'

const redisConfig = {
    host : config.redis.address,
    password : config.redis.password,
    port : config.redis.port,

};

let elasticClient = new elasticsearch.Client({
    host: config.elastic.host,
    log: config.elastic.log
});

elasticClient.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('[ELASTIC] elasticsearch cluster is down!');
    } else {
        console.log('[ELASTIC] All is well');
    }
});

mongoose.connect(config.mongo.uri, {
    useNewUrlParser: true
});

function addNewGw(message) {
    Gateway.findOne({gwMac: message.gateway}).exec().then(gw => {
        if (!gw) {
            const newGw = {
                gwMac: message.gateway
            }
            console.log(newGw);
            Gateway.create(newGw)
        } else {
            gw.update({$inc: {recievedPackets: 1}}).exec()
        }
    })
}

function addNewPacket(message) {
    if (typeof message.data !== 'string') return
    const rawPacket = lora_packet.fromWire(new Buffer(message.data, 'base64'));
    let buffers = rawPacket.getBuffers();
    let searchQuery;
    if (buffers.DevAddr) searchQuery = {devAddr:buffers.DevAddr.toString('hex')};
    if (buffers.DevEUI) searchQuery = {devEui:buffers.DevEUI.toString('hex')};
    const updateObj = {
        packet : message
    };
    const newDevicePacket = Object.assign({},searchQuery,updateObj);
    //console.log('[New Packet] -' , searchQuery);
    DevicePacket.create(newDevicePacket)

}

function setRadioUpdates(dev, freq, datr, gateway, appEui) {
    let updateObj = {$inc: {recievedPackets: 1}, $set: {}};

    const frqIdx = dev.radio.freq.findIndex(frq => {
        return frq.hasOwnProperty(freq)
    });
    (frqIdx !== -1) ? updateObj.$inc['radio.freq.' + frqIdx + '.' + freq] = 1 : updateObj.$set['radio.freq.' + dev.radio.freq.length] = {[freq]: 1};

    const datrIdx = dev.radio.datr.findIndex(d => {
        return d.hasOwnProperty(datr)
    });
    (datrIdx !== -1) ? updateObj.$inc['radio.datr.' + datrIdx + '.' + datr] = 1 : updateObj.$set['radio.datr.' + dev.radio.datr.length] = {[datr]: 1};

    const gatewayIdx = dev.radio.gateway.findIndex(gw => {
        return gw.hasOwnProperty(gateway)
    });
    (gatewayIdx !== -1) ? updateObj.$inc['radio.gateway.' + gatewayIdx + '.' + gateway] = 1 : updateObj.$set['radio.gateway.' + dev.radio.gateway.length] = {[gateway]: 1};

    if (appEui) {
        const appEuiIdx = dev.appEui.findIndex(ae => {
            return ae.hasOwnProperty(appEui)
        });
        (appEuiIdx !== -1) ? updateObj.$inc['appEui.' + appEuiIdx + '.' + appEui] = 1 : updateObj.$set['appEui.' + dev.appEui.length] = {[appEui]: 1};
    }
    return updateObj;
}

function addNewDevice(message) {
    if (typeof message.data !== 'string') return
    const rawPacket = lora_packet.fromWire(new Buffer(message.data, 'base64'));
    let buffers = rawPacket.getBuffers();
    let searchQuery;
    if (buffers.DevAddr) searchQuery = {devAddr:buffers.DevAddr.toString('hex')};
    if (buffers.DevEUI) searchQuery = {devEui:buffers.DevEUI.toString('hex')};


    const freq = (parseFloat(message.freq) * 1e6).toString();
    const datr = message.datr;
    const gateway = message.gateway;
    let appEui;
    if (buffers.AppEUI) appEui = buffers.AppEUI.toString('hex');

    AirDevice.findOne(searchQuery).exec().then(dev => {
        if (!dev) {
            let updateObj = { radio : {
                    freq : {[freq] : 1},
                    datr : {[datr] : 1},
                    gateway : {[gateway] : 1},
                } };
            if (appEui) updateObj.appEui = {[appEui] : 1};

            const newDev = Object.assign({},searchQuery,updateObj);
          //  console.log('[New Device] -' , searchQuery);
            AirDevice.create(newDev)
        } else {
         //   console.log('[Old Device] -' , searchQuery);
            let updateObj = setRadioUpdates(dev, freq, datr, gateway, appEui);

            dev.update(updateObj).exec()
        }
    })
}


export default function run() {

    let subUp = redis.createClient(redisConfig),
        subDown = redis.createClient(redisConfig),
        pub = redis.createClient(redisConfig);

    let gwPattUp = 'lora:ns:nb:push_data:*';
    let gwPattDown = 'lora:nb:ns:pull_resp:*';

    subUp.psubscribe(gwPattUp);
    subDown.psubscribe(gwPattDown);
    console.log(hello());
    subUp.on('pmessage', function (pattern, channel, messageString) {
        console.log(`[REDIS:Redis INFO] Messaggio da: ${channel}, Msg: ${messageString}`);
        let channels = channel.split(":");
        let message = JSON.parse(messageString);
        addNewGw(message);
        addNewDevice(message);
        addNewPacket(message);
    });
}


function hello(user = 'World') {
  return `Hello ${user}!\n`;
}
