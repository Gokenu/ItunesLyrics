/**
 * An example file to learn how iTunes-bridge works
 *
 * @projectname  iTunes-bridge
 * @version 0.5.0-beta
 * @author AngryKiller
 * @copyright 2018
 * @license GPL-3.0
 *
 */
const iTunes = require('./itunes-bridge');
const background = require("./background.js");
const Koa = require("koa");
const { PassThrough } = require("stream");
const fs = require('fs');
const serve = require('koa-static');
const path = require('path');
const main = serve(path.join(__dirname));

const sse = (event, data) => {
    return `event: ${ event }\ndata: ${ data }\n\n`
}

let lyrics = ''
let lastSong = ''
let lastStartTime = 0
let retryByHand = false
new Koa().
use(async (ctx, next) => {
    if (ctx.path !== "/sse") {
        if(ctx.path === "/confirmLyrics"){
            var ct = iTunes.getCurrentTrack()
            background.ConfirmLyrics(ct.name,ct.artist ,lyrics)
        }
        if(ctx.path === "/tryQQWithArtist"){
            var ct = iTunes.getCurrentTrack()
            const promise = new  Promise(async (resolve) => {
                let newLyrics = await background.GetLyricsByQQMusic(ct.name,ct.artist)
                resolve(newLyrics);
            });
            promise.then((newLyrics) => {
                if (newLyrics !== undefined && newLyrics.length > 0) {
                    lyrics = newLyrics;
                    retryByHand = true
                }
            })
        }
        if(ctx.path === "/tryNetEase"){
            var ct = iTunes.getCurrentTrack()
            const promise = new  Promise(async (resolve) => {
                let songId = await background.SearchSongId(ct.name, "")
                let newLyrics = await background.SearchLyrics(songId)
                resolve(newLyrics);
            });
            promise.then((newLyrics) => {
                if (newLyrics !== undefined && newLyrics.lyric !== undefined && newLyrics.lyric.length > 0) {
                    lyrics = newLyrics.lyric;
                    retryByHand = true
                }
            })
        }
        return await next();
    }

    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);

    ctx.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });

    const stream = new PassThrough();

    ctx.status = 200;
    ctx.body = stream;
    setTimeout(async function run() {
        var ct = iTunes.getCurrentTrack();

        // song switch
        if (ct.name !== lastSong) {
            const promise = new  Promise(async (resolve) => {
                /* gets active tab info */
                // let songId = await background.SearchSongId(ct.name, "")
                // let newLyrics = await background.SearchLyrics(songId)

                // try local confirmed lyrics first
                let newLyrics =   background.GetLyricsByLocal(ct.name,ct.artist)
                if(newLyrics === ''){
                    newLyrics = await background.GetLyricsByQQMusic(ct.name)
                }
                resolve(newLyrics);
            });

            promise.then((newLyrics) => {
                lastSong = ct.name
                // console.log(newLyrics.lyric)

                var resp = {songSwitch: true, Lyrics: "", startTime: 0}
                if (newLyrics !== undefined && newLyrics.length > 0) {
                    lyrics = newLyrics;
                    resp.Lyrics = background.createLrcObj(lyrics)
                }
                ct = iTunes.getCurrentTrack();
                resp.startTime = Math.floor(Date.now() / 1000) - ct.elapsedTime
                lastStartTime= resp.startTime
                stream.write(sse('message', JSON.stringify(resp)));
                setTimeout(run, 1000);
            });
        }else {
            var checkStartTime = Math.floor(Date.now() / 1000) - ct.elapsedTime
            var resp = {songSwitch: false, Lyrics: "", startTime: 0}
            if(Math.abs(checkStartTime-lastStartTime)>1){
                resp.startTime = checkStartTime
                lastStartTime = checkStartTime
            }
            if(retryByHand){
                resp.songSwitch = true
                resp.Lyrics = background.createLrcObj(lyrics)
                retryByHand = false
            }

            stream.write(sse('message', JSON.stringify(resp)));
            setTimeout(run, 1000);
        }

    }, 1000);
})
    .use(main)
    .use(ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./index.html');
})
    .listen(8080, () => console.log("Listening"));