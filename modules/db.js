const {MongoClient} = require('mongodb')
var ObjectId = require('mongodb').ObjectId;
const uriConnect = process.env['MONGODB_KEY']
async function getapi(url) {
  const response = await fetch(url);
  var data = await response.json();
  return data
}
async function getDoc(db, coll, query) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var res = await collection.findOne(query)
    return res
  } catch (e) {
    console.log(e)
    return e
  } finally {
    await client.close();
  }
}
async function getDocsWithLimit(db, coll, query, lim) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var cursor = collection.find(query).limit(lim)
    var res = []
    for await(const doc of cursor) {
      res.push(doc)
    }
    return res
  } catch (e) {
    console.log(e)
    return e
  } finally {
    await client.close();
  }
}
async function getDocs(db, coll, query) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var cursor = collection.find(query)
    var res = []
    for await(const doc of cursor) {
      res.push(doc)
    }
    return res
  } catch (e) {
    console.log(e)
    return e
  } finally {
    await client.close();
  }
}
async function updateDoc(db, coll, query, update) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var res = await collection.updateOne(
      query, 
      {
        $set: update
      }
    )
    return res
  } catch(e) {
    console.log(e)
  } finally {
    await client.close();
  }
}
async function modifyDoc(db, coll, query, update) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var res = await collection.updateOne(
      query, 
      update
    )
    return res
  } catch(e) {
    console.log(e)
  } finally {
    await client.close();
  }
}
async function getSortedDB (db, coll, sortFx, query) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var cursor = collection.find(query).sort(sortFx)

    var res = []
    for await(const doc of cursor) {
      res.push(doc)
    }
    return res
  } catch (e) {
    console.log(e)
    return e
  } finally {
    await client.close();
  }
}
async function deleteDoc(db, coll, id) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var res = await collection.deleteOne({_id: new ObjectId(id)})
    return res
  } catch(e) {
      
     console.log("error deleting from DB:" + e) 
  } finally {
    await client.close()
  }
}
async function insert(db, coll, doc) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var res = await collection.insertOne(doc)
    return res
  } catch(e) {
    console.log(e);
    return e
  } finally {
    await client.close();
  }
}
async function upsertDoc(db, coll, query, doc) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var res = await collection.updateOne(query, {
      $set: doc
    }, {
      $upsert: true
    })
    return res
  } catch(e) {
    console.log(e);
    return e
  } finally {
    await client.close();
  }

}

async function getPageData(db, coll, query, page, docsPerPage) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    var res = []
    const collection = client.db(db).collection(coll)
    var cursor = collection.aggregate([
      {
        $match: query
      },
      {
        $skip: docsPerPage * (page-1) //skip the pages already seen
      },
      {
        $limit: docsPerPage
      }
    ])
    for await (var x of cursor) { 
      res.push(x)
    }
    return res
  } catch(e) {
    console.log(e);
    return e
  } finally {
    await client.close();
  }
}

async function newGetPageData(db, coll, query, page, docsPerPage) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var out = {
      res: [],
      totalNotes: collection.countDocuments(query)
    }
    var cursor = collection.aggregate([
      {
        $match: query
      },
      {
        $skip: docsPerPage * (page-1) //skip the pages already seen
      },
      {
        $limit: docsPerPage
      }
    ])
    for await (var x of cursor) { 
      out.res.push(x)
    }
    console.log(out)
    return out
  } catch(e) {
    console.log(e);
    return e
  } finally {
    await client.close();
  }
}

async function newGetPageData(db, coll, query, page, docsPerPage) {
  const client = new MongoClient(uriConnect)
  await client.connect();
  try {
    const collection = client.db(db).collection(coll)
    var totalNotes = await collection.countDocuments(filter=query).then((number)=>{
      return number
    })
    var out = {
      res: [],
      totalNotes: totalNotes
    }
    var cursor = collection.aggregate([
      {
        $match: query
      },
      {
        $skip: docsPerPage * (page-1) //skip the pages already seen
      },
      {
        $limit: docsPerPage
      }
    ])
    for await (var x of cursor) { 
      out.res.push(x)
    }
    return out
  } catch(e) {
    console.log(e);
    return e
  } finally {
    await client.close();
  }
}

exports.getPageData = getPageData
exports.newGetPageData = newGetPageData
exports.getDocs = getDocs
exports.updateDoc = updateDoc
exports.getSortedDB = getSortedDB
exports.deleteDoc = deleteDoc
exports.insert = insert
exports.getapi = getapi
exports.getDoc = getDoc
exports.modifyDoc = modifyDoc
exports.getDocsWithLimit = getDocsWithLimit
exports.upsertDoc = upsertDoc