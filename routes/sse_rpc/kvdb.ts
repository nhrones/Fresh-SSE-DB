// deno-lint-ignore-file no-explicit-any

/** 
 *  A cache of a KvDb-collection.    
 *  This is a consistant cache,   
 *  It's kept in sync with the Deno.Kv database.   
 *  We load it once on cold start.
 */
export let shadowCache: Map<any, any>
const DEV = true
//@ts-ignore ?
let db: Deno.Kv
async function initDB() { 
   //@ts-ignore ?
   db = await Deno.openKv();
}  

/**
 * load an in-memory dataset            
 */
export const loadCache = async () => {
   if (!shadowCache) {
      const result = await getAll()
      shadowCache = new Map(result)
   }
   fireMutationEvent(-0, "cacheLoaded")
}

/**
 * delete a record
 */
export async function deleteRow(key: any[]) {
   if (!db) await initDB()
   const result = await db.delete(key);
   shadowCache.delete(key[1])
   fireMutationEvent(key[1], "RowDeleted")
   return result
}

/**
 * get a record
 */
export async function getRow(key: any[], _version: string) {
   if (!db) await initDB()
   const result = await db.get(key)
   return result
}

/**
 * set a record
 */
export async function setRow(key: any[], value: any) {
   if (DEV === true) console.info('called setRow with key = ', key)
   if (!db) await initDB()
   const result = await db.set(key, value);
   if (result.versionstamp) {
      if (DEV === true) console.log(`set shadowCache id ${key[1]} = ${JSON.stringify(value)}`)
      shadowCache.set(key[1], value)
      fireMutationEvent(key[1], "SetRow")
   } else {
      console.error('kvdb.setRow failed!')
   }
   return result
}

/**
 *  bulk fetch - get record collection 
 */
export async function getAll() {
   const fetchStart = performance.now()
   if (!shadowCache)  shadowCache = new Map()
   if (!db) await initDB()
   // we'll just rebuild our cache for each new client
   const entries = db.list({ prefix: [] })
   for await (const entry of entries) {
      if (DEV === true) console.info(`key:${entry.key}. val:`, entry.value)
      shadowCache.set(entry.key, entry.value)
   }

   const fetchTime = (performance.now() - fetchStart).toFixed(2)
   if (DEV === true) console.log(`Loading ${shadowCache.size} records in cache took -  ${fetchTime}ms`)
   if (shadowCache.size < 2) {
      if (DEV === true) console.warn('No data found! Loading initial testset!')
      await loadTestSet()
      const entries = db.list({ prefix: [] })
      for await (const entry of entries) {
         if (DEV === true) console.info(`key:${entry.key}. val:`, entry.value)
         shadowCache.set(entry.key, entry.value)
      }
   }
   return Array.from(shadowCache.entries())
}

/** delete all rows from the db */
export async function clearAll() {
   if (!db) await initDB()
   if (DEV === true) console.warn('clearing data')
   getAllKeys()
      .then((keys) => {
         keys.forEach( (key) => {
            db.delete(key)
         })
      })
}

/**  bulk fetch */
export async function getAllKeys() {
   const allKeys = []
   if (!db) await initDB()
   const entries = db.list({ prefix: [] })
   for await (const entry of entries) {
      allKeys.push(entry.key)
   }
   return allKeys
}

export async function loadTestSet() {
   if (!db) await initDB()
   await db.set(["env", "cwd"], "./")
   await db.set(["env", "host"], "http://localhost")
   await db.set(["env", "port"], 9099)
   await db.set(["cfg", "target"], "./dist")
   await db.set(["cfg", "include"], "./src")
   await db.set(["cfg", "options"], { debug: true, useKv: true, dbFile: "./data/db.db" })
   await db.set(["users", 1], { id: 1, first: "John", last: "Doe", age: 25, address: { street: '123 Main st.', city: 'Gotham', state: "CA", zip: 45927 } })
   await db.set(["users", 2], { id: 2, first: "Jim", last: "Smith", age: 35, address: { street: '456 A st.', city: 'Fremont', state: "CA", zip: 45938 } })
   await db.set(["users", 3], { id: 3, first: "Joe", last: "Smoe", age: 45, address: { street: '789 B st.', city: 'Hayward', state: "CA", zip: 45941 } })
}


/**
 * Fire an event reporting a DenoKv record mutation
 */
const fireMutationEvent = (rowID: number, type: string) => {
   const bc = new BroadcastChannel("sse-rpc")
   bc.postMessage({ txID: -1, procedure: "MUTATION", params: { rowID, type } })
   bc.close();
}