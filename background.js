

const XMLHttpRequest = require('xhr2');
const axios = require('axios');
const qqMusic = require('qq-music-api');
const fs = require('fs')
qqMusic.setCookie('pac_uid=0_0b026266c705b; pgv_pvid=2178677102; fqm_pvqid=7f31c1ed-adfe-495b-8949-bae7fc090edc; ts_refer=www.google.com/; ts_uid=7946023580; fqm_sessionid=47491527-1697-4e99-b114-004ed1857a30; pgv_info=ssid=s3398131563; ts_last=y.qq.com/n/ryqq/profile/like/song; _qpsvr_localtk=0.17422325362994062; wxuin=1152921504960398967; qm_keyst=W_X_5m5FG-FnaEwBr2Z_GiCuhbz4o9F-Ro4AYvwBSc_rmoBzEmYUKqT2OC3q-s4oito5o5UKgjijVlew; psrf_qqaccess_token=; tmeLoginType=1; psrf_qqopenid=; psrf_qqrefresh_token=; qm_keyst=W_X_5m5FG-FnaEwBr2Z_GiCuhbz4o9F-Ro4AYvwBSc_rmoBzEmYUKqT2OC3q-s4oito5o5UKgjijVlew; wxrefresh_token=56_iqEMZijpWaszPRKyq4fiwh6eD2yK8dNOWj4WqFbb0SNM8nq9LLAKf-U_N9PR1Zi6jvcNByF_7gGt5Ov9sCCQSHYG3ZIuprIZnlY8CJ6CCOA; wxopenid=opCFJw8h3dWP4RKPVnC_64vXIIM0; qqmusic_key=W_X_5m5FG-FnaEwBr2Z_GiCuhbz4o9F-Ro4AYvwBSc_rmoBzEmYUKqT2OC3q-s4oito5o5UKgjijVlew; wxuin=1152921504960398967; psrf_qqunionid=; wxunionid=oqFLxsrBV6GvVYSNrHd6zBwZD1jc; euin=oK6kowEAoK4z7eEsoeoqNeEs7z**; login_type=2');
function GetLyricsByQQMusic(songName,artist){
    return new Promise((resolve,reject)=>{
        let keyword = songName
        if(artist!==''){
            keyword += " "+artist
        }
        qqMusic.api('search', { key: keyword })
            .then(
                (res) => {
                    if(res.list.length>0){
                        qqMusic.api('lyric', { songmid:  res.list[0].songmid })
                            .then(
                                (res) => {
                                    try {
                                        resolve(res.lyric)
                                    }catch (e){
                                        resolve("")
                                    }
                                }
                            )
                            .catch(err => resolve(""))
                    }

                }
            )
            .catch(err => resolve(""))
    })
}
function GetLyricsByLocal(songName,artist){
    try{
        let data = fs.readFileSync('./lyricslib/'+artist+' - '+songName);
        return data.toString()
    }catch (e) {
        return ""
    }
}
function SearchSongId(songName,artist){
    return new Promise((resolve,reject)=>{
        var qs = require('qs');
        var data = qs.stringify({
            's': songName,
            'offset': '0',
            'limit': '1',
            'type': '1'
        });
        var config = {
            method: 'post',
            url: 'https://music.163.com/api/search/pc',
            headers: {
                'cookie': '_ntes_nnid=cd6247f02e7ef6ec4f44e62ebca62920,1647630296050; _ntes_nuid=cd6247f02e7ef6ec4f44e62ebca62920; hb_MA-B701-2FC93ACD9328_source=mail.nankai.edu.cn; NMTID=00OBe1WGnVQWNKHfkAlsQRSqjc1gQMAAAGAnThjww; WNMCID=fzdrwh.1651905159311.01.0; WEVNSM=1.0.0; WM_TID=eCc5XmPxwN1BBRFRBRPFQYe2D4Fo3Clf; MUSIC_U=7cf9abec7601ab95e6905d7a30602a9dcf34cb06c52baf00dcec00a04c853053519e07624a9f0053ce4518da332aa0767f0999f9b1ee21e5be688dbe6cc68135bc1e58d80185506f1b93ac14e0ed86ab; __remember_me=true; __csrf=63bf616e179feda3e7e0dbdc182cb504; ntes_kaola_ad=1; _iuqxldmzr_=32; JSESSIONID-WYYY=RmpmemUUVab4KTz3W%5CO6mMz2K82X3IQfrYy1HPT9GhD2TM3KW2p9tra7zCdUo%2FJnjmwBySIJOiw5qvpQvdjWvmVz2YOXXznPOjK15iy9JzxkRAO3CmaKhmvG%5CZ94m0zTPEGKfQQBq9WEfu%2F6jFFHdtbSQ9K6tfH4UGQPOkPT7hfDr2yU%3A1652324168405; WM_NI=YTnpwyVQIIsB6YbR7xJ36njBB3ohH2F3nvyff5Y7MWfvyeur%2BuWD0u0H%2F6i8rWZ1ElBYg6j3pigsNnTqJSphcKXb6VrMI5FnLwscwNAuL7ZFQfwcYBF1fHjfF8LtlDSqbHQ%3D; WM_NIKE=9ca17ae2e6ffcda170e2e6eea9d83aa193ada8eb6dbb928ea3c45b929e8ab0c44a8bebbcb3f9738794baabc92af0fea7c3b92a9b8ca291f673968f87aaf24af687aeb3b6748aedfa8fe94a82eda189cb3a86eda297fc6ea6eb97d8d05da6aab786f87ae9ab99a5b37ff498e1d7ec34b28996d2c8688287a9d7e939b4b7a994cd6698af86b4f364a1959883b55eb29387d6c56690a9bd84f64683ab84d8d94e93bab984dc4a86efaaa9e96e86e88495ef5091afaea9d437e2a3; csrfToken=Kgg_Xw3TCGIgis3qpdeHWOZG; NMTID=00Oj3k5pZjXnH-2dkpopU0kJEknGYIAAAGAtisgpg',
                'withCredentials': 'true',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
        };
        axios(config)
            .then(res => {
                // console.log(`statusCode: ${res.status}`);
                // console.log(res);
                resolve(res.data.result.songs[0].id);
            })
            .catch(error => {
                console.error(error);
            });

    })
}
function SearchLyrics(songId){
    console.log("begin search song id:"+songId)
    return new Promise((resolve,reject)=>{
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'http://music.163.com/api/song/media?id='+songId, true);
    httpRequest.send();

    httpRequest.onreadystatechange = function () {

        if(httpRequest.readyState === 4){
            if ( httpRequest.status === 200) {
                const json = httpRequest.responseText;
                const obj = JSON.parse(json);
                resolve(obj);
            }else{
                reject(httpRequest.status);
            }
        }
    };
    })
}
function createLrcObj(lrc) {
    var oLRC = {
        ti: "", //歌曲名
        ar: "", //演唱者
        al: "", //专辑名
        by: "", //歌词制作人
        offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
        ms: [] //歌词数组{t:时间,c:歌词}
    };
    if(lrc.length==0) return;
    var lrcs = lrc.split('\n');//用回车拆分成数组
    for(var i in lrcs) {//遍历歌词数组
        lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
        var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
        var s = t.split(":");//分离:前后文字
        if(isNaN(parseInt(s[0]))) { //不是数值
            for (var i in oLRC) {
                if (i != "ms" && i == s[0].toLowerCase()) {
                    oLRC[i] = s[1];
                }
            }
        }else { //是数值
            var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
            var start = 0;
            for(var k in arr){
                start += arr[k].length; //计算歌词位置
            }
            var content = lrcs[i].substring(start);//获取歌词内容
            if(content.length<1){
                continue
            }
            for (var k in arr){
                var t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
                var s = t.split(":");//分离:前后文字
                oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                    t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                    c: content
                });
            }
        }
    }
    oLRC.ms.sort(function (a, b) {//按时间顺序排序
        return a.t-b.t;
    });
    return oLRC

}
function ConfirmLyrics(songName,artist,lyrics){
    fs.writeFile('./lyricslib/'+artist+' - '+songName, lyrics, err => {
        if (err) {
            console.error(err)
            return
        }
        //文件写入成功。
    })
}
module.exports = {
    SearchLyrics,
    SearchSongId,
    createLrcObj,
    GetLyricsByQQMusic,
    ConfirmLyrics,
    GetLyricsByLocal
}