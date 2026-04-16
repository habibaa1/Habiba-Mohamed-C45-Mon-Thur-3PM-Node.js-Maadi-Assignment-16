import { Model } from "mongoose";
import { IUser } from "../../common/interfaces";
import { BaseRepository } from "./base.reposatory";

export class UserRepository extends  BaseRepository<IUser> {
        constructor( model: Model<IUser>) {
            super(model)
        }
        
}
