export type Subject = {
    id:number,
    name:string
}

export type Invoice = {
    id:number,
    number:number,
    invoiceFileUrl:string,
    issuingDate:Date
}

export type Address = {
    id:number,
    street:string,
    houseNumber:string,
    city:string,
    province:string,
    postalCode:string
}

export type Student = {
    id: number,
    name:string,
    surname:string,
    email:string,
    role:string
    address:Address,
    isEnabled:boolean,
    cf:string
}

export type Teacher = {
    id: number,
    name:string,
    surname:string,
    email:string,
    role:string
    address:Address,
    isEnabled:boolean,
    cf:string,
    piva:string
    feedback:number
}

export type Request = {
    id:number,
    questionUrl:string,
    solutionUrl:string,
    title:string,
    subject:Subject,
    requestState:string,
    invoice:Invoice
    student:Student
    feedback: FeedBack
}

export type Solution = {
    id:number,
    request:Request,
    teacher:Teacher,
    solutionUrl:string,
    state:string,
    price:number
}

export type FeedBack = {
    id:number,
    score:number
}

export type FeedBackResponse = {
    score:number
}

// export type NumericalObject = {
//     [key: string]: number;
//   };

export type User = {
    name:string,
    surname:string,
    email:string,
    password:string,
    cf:string,
    role:string,
    street:string,
    houseNumber:string,
    city:string,
    province:string,
    postalCode:string,
    piva:string
}

export type UserToModify = {
    name:string,
    surname:string,
    email:string,
    cf:string,
    role:string,
    street:string,
    houseNumber:string,
    city:string,
    province:string,
    postalCode:string,
    piva:string
}

export type UserFromDB = {
    name:string;
    surname:string;
    email:string;
    cf:string;
    role:string;
    address:Address
    piva:string
}