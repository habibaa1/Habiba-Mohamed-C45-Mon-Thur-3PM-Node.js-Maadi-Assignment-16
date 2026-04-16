import { AnyKeys, CreateOptions, FlattenMaps, HydratedDocument, Model, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types, UpdateQuery, UpdateWithAggregationPipeline , MongooseUpdateQueryOptions, UpdateResult, DeleteResult, ReturnsNewDoc} from "mongoose";
import { IUser } from "../../common/interfaces";
export abstract class BaseRepository<TRawDocument> {


        constructor(protected readonly model: Model<TRawDocument>) {}

        async create({
            data,
        }: {
            data : AnyKeys<TRawDocument>, 
        }) : Promise<HydratedDocument<TRawDocument>>;


        async create({
            data,
            options
        }: {
            data : AnyKeys<TRawDocument>[], 
            options?: CreateOptions | undefined
        }) : Promise<HydratedDocument<TRawDocument>[]>;


        async create({
            data,
            options
        }: {
            data : AnyKeys<TRawDocument>[], 
            options?: CreateOptions | undefined
        }) : Promise<HydratedDocument<TRawDocument>[] | HydratedDocument<TRawDocument>> 
        {
            return await this.model.create(data as any,options)
        }
        async createOne({
            data,
            options
        }: {
            data : AnyKeys<TRawDocument>,
            options?: CreateOptions | undefined

        }) : Promise<HydratedDocument<TRawDocument>> {
            const [doc] = await this.create({data:[data], options})
            return doc as HydratedDocument<TRawDocument>
        }
        
        //find

        async findOne({
            filter,
            projection,
            options
        }:{
            filter?: QueryFilter<TRawDocument>,
            projection?:ProjectionType<TRawDocument> | undefined,
            options?: QueryOptions<TRawDocument> &{lean:false} | null | undefined
        }): Promise<HydratedDocument<IUser>| null> 

            
        async findOne({
            filter,
            projection,
            options
        }:{
            filter?: QueryFilter<TRawDocument>,
            projection?:ProjectionType<TRawDocument> | undefined,
            options?: QueryOptions<TRawDocument> &{lean:true} | null | undefined
        }): Promise< null|FlattenMaps<IUser>> 
        async findOne({
            filter,
            projection,
            options
        }:{
            filter?: QueryFilter<TRawDocument>,
            projection?:ProjectionType<TRawDocument> | undefined,
            options?: QueryOptions<TRawDocument> | null | undefined
        }): Promise<any> {
            const doc = this.model.findOne(filter,projection)

            if (options?.lean)doc.lean(options.lean);
            if (options?.populate)doc.populate(options.populate as PopulateOptions[]);
            return await doc.exec() 
            }

//find by id
        async findbyId({
            _id,
            projection,
            options
        }:{
            _id?: Types.ObjectId,
            projection?:ProjectionType<TRawDocument> | undefined,
            options?: QueryOptions<TRawDocument> &{lean:false} | null | undefined
        }): Promise<HydratedDocument<IUser>| null> 


        async findbyId({
            _id,
            projection,
            options
        }:{
            _id?: Types.ObjectId,
            projection?:ProjectionType<TRawDocument> | undefined,
            options?: QueryOptions<TRawDocument> &{lean:true} | null | undefined
        }): Promise< null|FlattenMaps<IUser>> 
        async findbyId({
            _id,
            projection,
            options
        }:{
            _id?: Types.ObjectId,
            projection?:ProjectionType<TRawDocument> | undefined,
            options?: QueryOptions<TRawDocument> | null | undefined
        }): Promise<any> {
            const doc = this.model.findById(_id, projection)

            if (options?.lean)doc.lean(options.lean);
            if (options?.populate)doc.populate(options.populate as PopulateOptions[]);
            return await doc.exec() 
            }

    //update
    async findOneAndUpdate ({
        filter,
        update,
        options = {new: true}
    }:{
        filter: QueryFilter<TRawDocument>,
        update: UpdateQuery<TRawDocument>,
        options:QueryOptions<TRawDocument> & ReturnsNewDoc
    }) : Promise<HydratedDocument<TRawDocument>| null> {
        return await this.model.findOneAndUpdate(filter, update, options )
    }
    async findbyIdAndUpdate ({
        _id,
        update,
        options = {new: true}
    }:{
        _id: Types.ObjectId,
        update: UpdateQuery<TRawDocument>,
        options:QueryOptions<TRawDocument> & ReturnsNewDoc
    }) : Promise<HydratedDocument<TRawDocument>| null> {
        return await this.model.findByIdAndUpdate(_id, update, options )
    }
    async updateOne ({
        filter,
        update,
        options
    }:{
        filter: QueryFilter<TRawDocument>,
        update: UpdateQuery<TRawDocument>| UpdateWithAggregationPipeline,
        options?:MongooseUpdateQueryOptions| null
    }) : Promise<UpdateResult>{
        return await this.model.updateOne(filter, update, options )
    }

    async updateMany ({
        filter,
        update,
        options
    }:{
        filter: QueryFilter<TRawDocument>,
        update: UpdateQuery<TRawDocument>| UpdateWithAggregationPipeline,
        options?:MongooseUpdateQueryOptions| null
    }) : Promise<UpdateResult>{
        return await this.model.updateMany(filter, update, options )
    }

    //delete
    async findOneAndDelete ({
        filter,
    }:{
        filter: QueryFilter<TRawDocument>,
    }) : Promise<HydratedDocument<TRawDocument>| null> {
        return await this.model.findOneAndDelete(filter )

    }
    async findbyIdAndDelete ({
        _id,
    }:{
        _id: Types.ObjectId,
    }) : Promise<HydratedDocument<TRawDocument>| null> {
        return await this.model.findByIdAndDelete(_id)
    }
        async deleteOne ({
        filter,
    }:{
        filter: QueryFilter<TRawDocument>,
    }) : Promise<DeleteResult>{
        return await this.model.deleteOne(filter )
    }

    async deleteMany ({
        filter,
    }:{
        filter: QueryFilter<TRawDocument>,
    }) : Promise<DeleteResult>{
        return await this.model.deleteMany(filter )
    }
}

