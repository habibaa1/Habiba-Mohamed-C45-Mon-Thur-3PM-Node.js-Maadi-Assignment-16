import { CreateOptions, HydratedDocument, Model } from "mongoose";

export abstract class BaseRepository<TRawDocument> {
        constructor(protected readonly model: Model<TRawDocument>) {}
        async create({data,options}: {data : Partial<TRawDocument>[], options?: CreateOptions}) : Promise<HydratedDocument<TRawDocument>[]> {
            return await this.model.create(data as any,options)
        }
}