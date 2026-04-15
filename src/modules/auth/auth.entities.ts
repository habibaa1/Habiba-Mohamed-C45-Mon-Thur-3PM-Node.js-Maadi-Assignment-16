export interface ILoginRessponse{
    email:string,
    password:string
}

export interface ISignupResspones extends ILoginRessponse{
    username:string
    _id:string
}