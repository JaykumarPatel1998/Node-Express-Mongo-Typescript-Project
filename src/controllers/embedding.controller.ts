import { Request, RequestHandler } from "express"
import { generateEmbeddingFromText } from "../fileUtils/generateToken";
import { MongoClient } from "mongodb";
import File from "../models/file";

// connect to your Atlas cluster
const uri = process.env.MONGO_URL!;

const client = new MongoClient(uri);

interface ExtendedRequest extends Request {
    id?: string;
}

interface FileDto 
    {
        fileUrl? : string,
        filename?: string,
        score? : number
      }

export const vectorSearch: RequestHandler = async (req: ExtendedRequest, res, next) => {
    try {
        await client.connect();

        if(!req.query.searchQuery){
            return res.render('embeddings', {files : undefined})
        }

        const database = client.db("project");
        const coll = database.collection("fileembeddings");
        const embedding = await generateEmbeddingFromText(req.query.searchQuery as string)
        const result = await coll.aggregate([
            {
              "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": embedding,
                "filter": {
                        "userId" : req.id?.toString()
                  }, 
                "numCandidates": 5,
                "limit": 4
              }
            }, {
                '$project': {
                    'fileId' : 1,
                    'userId' : 1, 
                    'score': {
                        '$meta': 'vectorSearchScore'
                    }
                }
              }
          ]).toArray()
          console.log(result)
          const files : FileDto[] = []

          for (let i = 0; i < result.length; i++) {
            const fileObj = await File.findById(result[i].fileId).exec()
            if(fileObj) {
                files.push({
                    filename : fileObj.fileName,
                    fileUrl : fileObj.fileUrl!,
                    score : result[i].score
                })
            }
          }
          

          return res.render('embeddings', {files});
          

    } catch (err) {
        next(err);
    }
}