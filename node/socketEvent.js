const io = require('./main').io
const MDB = require('./MDBHandle')
const USERS = MDB.users
var ONLINE={}
var _ONLINE={}

const events = {
    register(socket,{name,pas}){
       USERS.get(name,user=>{
           user.find().toArray((err,res)=>{
               if(res.length){
                   socket.emit('c_unified','c_register',{code:0,mes:'账号已存在'})
               }else{
                   USERS.create(name,res=>{
                       let initObj = [
                        {flag:'config',name:name,password:pas,friends:[],vip:0},
                        {flag:1,mes:{sys:[]}},
                        {flag:2,unread:{},system:{}}
                       ]
                       res.insertMany(initObj,err=>{
                           if(err){
                            throw new Error()
                           }
                       })
                       socket.emit('c_unified','c_register',{code:1,mes:'注册成功'})
                   })
               }
           })
       })
    },
    login(socket,{name,pas}){
        USERS.get(name,user=>{
            user.find({flag:'config'}).toArray((err,res)=>{
                let data = {}
                if(!res.length){
                    data = {code:0,mes:'账号不存在'}
                }else{
                    let config = res[0]
                    if(pas==config.password){
                        data = {code:1,data:config}
                        ONLINE[name] = socket.id
                        _ONLINE[socket.id] = name
                    }else{
                        data = {code:0,mes:'密码错误'}
                    }
                }
                socket.emit('c_unified','c_login',data)
            })
        })
    },
    sendMessage(socket,data){
        if(!(data&&data.sendBy&&data.sendTo)){
            return
        }
        let sendBy = data.sendBy
        USERS.get(sendBy,(user,users)=>{
            //user存入数据
            let userdata = Object.assign({},data.message,{flag:true})
            let sendTo = data.sendTo
            if(!sendTo){return}
            let o = {}
            o[`mes.${sendTo}`] = userdata
            user.updateOne({flag:1},{
                $push:o
            })
            //sendTo存入数据
            let id = ONLINE[sendTo]
            let to = users.collection(sendTo)
            if(id){
                io.to(id).emit('c_unified','receiveMessage',{sendBy,mes:data.message})
                let _o = {}
                _o[`mes.${sendBy}`] = data.message
                to.updateOne({flag:1},{
                    $push:_o
                })
            }else{
                let unread_mes = {}
                unread_mes[`unread.${sendBy}`]=data.message
                to.updateOne({flag:2},{
                    $push:unread_mes
                })
            }
            
        })
    },
    getUnread(socket,name){
        USERS.get(name,user=>{
            user.find({flag:2}).toArray((err,res)=>{
                if(err){
                    console.log(err)
                }else{
                    let unread = res[0].unread
                    if(Object.keys(unread).length){
                        socket.emit('c_unified','c_getUnread',unread)
                    }
                }
            })
        })
    },
    hasRead(socket,{from,to}){
        USERS.get(from,user=>{
            let m = {}
            m[`unread.${to}`] = 1
            user.updateOne({flag:2},{
                $unset:m
            })
        })
    }
}




function socketInit(socket){
    socket.on('unified',(type,data)=>{
        events[type](socket,data)
    })
    socket.on('disconnect',()=>{
        let name = _ONLINE[socket.id]
        if(name){
            delete ONLINE[name]
            delete _ONLINE[socket.id]
        }
    })
}

module.exports=socketInit