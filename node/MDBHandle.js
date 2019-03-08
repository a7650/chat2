const MDB = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

function connectMDB(fn) {
    MDB.connect(url, { useNewUrlParser: true }, (err, db) => {
        if (err) {
            throw new Error('error:connectMDB() error', err.message)
        }
        fn(db)
    })
}

module.exports={
    users:{
        get(name,fn){
           connectMDB(db=>{
                let users = db.db('users')
                var user = users.collection(name)
                fn(user,users)
                db.close()
            })
        },
        create(name,fn){
            connectMDB(db=>{
                let users = db.db('users')
                users.createCollection(name,(err,res)=>{
                    if(err){
                        throw new Error('error:user-create() error', err.message)
                    }
                    fn(res)
                    db.close()
                })
            })
        }
    }
}

