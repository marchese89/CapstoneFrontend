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
}

export type Solution = {
    id:number,
    request:Request,
    teacher:Teacher,
    solutionUrl:string,
    state:string,
    price:number
}